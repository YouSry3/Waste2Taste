from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import io
import os
import json
import logging
from PIL import Image
import numpy as np
from fastapi.staticfiles import StaticFiles

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Branding
API_NAME = "Waste2Taste AI API"
API_METHODOLOGY = (
    "Spoilage: Ensemble Inference with Category-Specific Cross-Validation. "
    "Sentiment: Accelerated DistilBERT Zero-shot Moderation."
)

app = FastAPI(
    title=API_NAME,
    description="Intelligent moderation and spoilage detection for food rescue operations.",
)

# Test directory logic removed as requested

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global systems
loaded_models = {}
loaded_labels = {}
sentiment_model = None

# Metadata Discovery
SPOILAGE_CATEGORIES = ["general", "bread", "meat", "dairy", "fish", "produce"]
DEFAULT_LABELS = {0: "Fresh", 1: "Spoiled"}

# Moderation Tag Definitions
SENTIMENT_DEFINITIONS = {
    "gratitude":      "grateful, happy and satisfied with the food",
    "disappointment": "disappointed with the food quality or quantity",
    "disgust":         "disgusted, food was rotten, moldy, or a health safety hazard",
    "frustration":     "frustrated with the merchant, pickup experience, or store being closed",
    "excitement":      "excited about an amazing deal or massive surprise find",
    "urgency":         "anxious or urgent about food expiring extremely soon"
}

LABEL_TO_ID = {v: k for k, v in SENTIMENT_DEFINITIONS.items()}
CANDIDATE_LABELS = list(SENTIMENT_DEFINITIONS.values())

def load_spoilage_models():
    """Load all optimized ONNX models from /models."""
    global loaded_models, loaded_labels
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    if not os.path.exists(models_dir): return
    try:
        import onnxruntime as ort
    except ImportError: return

    for filename in os.listdir(models_dir):
        if filename.endswith('.onnx'):
            is_general = (filename == 'spoilage_model.onnx')
            cat = 'general' if is_general else filename.replace('spoilage_', '').replace('.onnx', '')
            model_path = os.path.join(models_dir, filename)
            try:
                session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
                loaded_models[cat] = session
                
                label_filename = 'class_indices.json' if is_general else f'labels_{cat}.json'
                labels_path = os.path.join(models_dir, label_filename)
                if os.path.exists(labels_path):
                    with open(labels_path, 'r') as f:
                        indices = json.load(f)
                        loaded_labels[cat] = {v: k.capitalize() for k, v in indices.items()}
                else: loaded_labels[cat] = DEFAULT_LABELS
            except Exception as e:
                logger.error(f"Load error {cat}: {e}")

def load_sentiment_classifier():
    """Load the accelerated sentiment classifier."""
    global sentiment_model
    try:
        from transformers import pipeline
        # Switched to mDeBERTa for multilingual support (including Arabic)
        model_name = "MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7"
        sentiment_model = pipeline("zero-shot-classification", model=model_name)
        logger.info(f"Sentiment engine loaded: {model_name}")
    except Exception as e:
        logger.error(f"Sentiment load error: {e}")

@app.on_event("startup")
async def startup_event():
    load_spoilage_models()

def get_sentiment_classifier():
    """Lazy initialization of the sentiment model to save cold-boot RAM."""
    global sentiment_model
    if sentiment_model is None:
        load_sentiment_classifier()
    return sentiment_model

def preprocess_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        img_array = np.array(image, dtype=np.float32)
        img_array = (img_array / 127.5) - 1.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except: return None

@app.get("/", tags=["Info"])
async def index():
    """Service discovery and status."""
    return {
        "status": "online",
        "api": API_NAME,
        "methodology": API_METHODOLOGY,
        "supported_categories": SPOILAGE_CATEGORIES,
        "active_models": list(loaded_models.keys()),
        "moderation_tags": SENTIMENT_DEFINITIONS,
        "docs": "/docs"
    }

@app.post("/predict", tags=["Analysis"])
async def predict(
    file: UploadFile = File(...), 
    type: str = Query("general", description="Category: bread, meat, dairy, fish, produce")
):
    """
    Detect spoilage using the ensemble cross-validation strategy.
    
    Select a category (bread, meat, dairy, fish, produce) and upload an image for analysis.
    """
    global loaded_models, loaded_labels
    req_type = type.lower()
    
    candidates = ["general"]
    if req_type != "general" and req_type in loaded_models:
        candidates.append(req_type)
    
    contents = await file.read()
    processed_image = preprocess_image(contents)
    if processed_image is None:
        raise HTTPException(status_code=400, detail="Invalid image.")

    results = []
    for model_name in candidates:
        session = loaded_models[model_name]
        labels = loaded_labels.get(model_name, DEFAULT_LABELS)
        
        input_name = session.get_inputs()[0].name
        raw_pred = session.run(None, {input_name: processed_image})[0][0]
        
        idx = np.argmax(raw_pred)
        confidence = float(raw_pred[idx])
        
        # Default to the last index (Spoiled class in a binary Fresh/Spoiled model).
        # Fall back to index 1, but never exceed the actual output size.
        default_spoil_idx = min(1, len(raw_pred) - 1)
        spoil_idx = default_spoil_idx
        for i, lbl in labels.items():
            if lbl.lower() in ['rotten', 'spoiled', 'bad']:
                candidate = int(i)  # keys may be str or int after JSON round-trip
                if 0 <= candidate < len(raw_pred):
                    spoil_idx = candidate
                break

        results.append({
            "model_name": model_name,
            "prediction": labels.get(idx, "Unknown"),
            "confidence": round(confidence, 4),
            "spoiled_percentage": round(float(raw_pred[spoil_idx]) * 100, 2),
            "is_spoiled": float(raw_pred[spoil_idx]) > 0.5
        })

    if not results:
        raise HTTPException(status_code=503, detail="AI engines offline.")

    winner = max(results, key=lambda x: x["confidence"])
    
    return {
        "prediction": winner["prediction"],
        "confidence": winner["confidence"],
        "spoiled_percentage": winner["spoiled_percentage"],
        "is_spoiled": winner["is_spoiled"],
        "metadata": {
            "requested_type": req_type,
            "winner_model": winner["model_name"],
            "ensemble_scores": {r["model_name"]: r["confidence"] for r in results}
        }
    }

class SentimentRequest(BaseModel):
    text: str

@app.post("/sentiment", tags=["Analysis"])
async def sentiment(request: SentimentRequest):
    """Fast moderation tagging. Detects disgust, frustration, and success signals."""
    classifier = get_sentiment_classifier()
    if not classifier:
        raise HTTPException(status_code=503, detail="Sentiment engine starting...")

    result = classifier(request.text, candidate_labels=CANDIDATE_LABELS, multi_label=True)
    tags = {LABEL_TO_ID[l]: round(s, 4) for l, s in zip(result["labels"], result["scores"]) if s > 0.3}
    
    return {
        "tags": tags,
        "neutral": len(tags) == 0,
        "text": request.text
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
