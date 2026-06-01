# Waste2Taste AI API

A high-performance FastAPI service providing intelligent food spoilage detection (via optimized category-specific ONNX models) and multilingual interaction moderation (via zero-shot transformer classification).

---

## 🛠️ Technical Overview

### 1. Spoilage Detection
* **Model Engine**: Optimized ONNX Runtime (CPU) executing customized **MobileNetV2** architectures.
* **Input Sizing**: 224 x 224 RGB image, normalized to range `[-1.0, 1.0]`.
* **Category Models**:
  * `general`: `spoilage_model.onnx` (Global fallback)
  * `bread`: `spoilage_bread.onnx`
  * `dairy`: `spoilage_dairy.onnx`
  * `meat`: `spoilage_meat.onnx`
  * `produce`: `spoilage_produce.onnx`
  * *Note: `fish` uses the general model fallback.*
* **Ensemble Strategy**: Dynamic routing queries both the `general` and the category-specific model, returning the prediction with the highest confidence score.

### 2. Moderation & Sentiment Analysis
* **Model Engine**: Zero-shot classifier using `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7`.
* **Multilingual Capability**: Natively supports Arabic and English feedback.
* **Memory Management**: Lazy-loaded engine initializes on the first request to prevent cold-boot memory spikes.
* **Classification Tags**:
  * `gratitude` (Grateful/happy)
  * `disappointment` (Low quality/quantity)
  * `disgust` (Rotten/unsafe food)
  * `frustration` (Pickup/store issues)
  * `excitement` (Surprise discovery/deal)
  * `urgency` (Expiring extremely soon)

---

## 🚀 API Endpoints

### 1. Status Discovery
* **Method**: `GET /`
* **Response**: Lists API metadata, supported categories, active loaded models, and moderation tag definitions.

### 2. Spoilage Prediction
* **Method**: `POST /predict`
* **Query Parameters**: `type` (options: `general`, `bread`, `meat`, `dairy`, `produce` - defaults to `general`)
* **Request Body**: Multipart form data with key `file` (image upload).
* **Response**:
  ```json
  {
    "prediction": "Fresh" | "Spoiled",
    "confidence": 0.9854,
    "spoiled_percentage": 1.46,
    "is_spoiled": false,
    "metadata": {
      "requested_type": "bread",
      "winner_model": "bread",
      "ensemble_scores": { "general": 0.9421, "bread": 0.9854 }
    }
  }
  ```

### 3. Sentiment Tagging
* **Method**: `POST /sentiment`
* **Request Body**:
  ```json
  { "text": "الأكل كان رائعاً وشكراً جزيلاً لكم" }
  ```
* **Response**: Returns matching labels with confidence scores exceeding `0.3`:
  ```json
  {
    "tags": { "gratitude": 0.9785 },
    "neutral": false,
    "text": "الأكل كان رائعاً وشكراً جزيلاً لكم"
  }
  ```

---

## 📦 Local Development

1. **Setup Environment**:
   ```bash
   cd AI
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Run Service**:
   ```bash
   python -m src.main
   ```
   The interactive Swagger documentation will be available at `http://localhost:8080/docs`.

---

## ☁️ Railway Deployment
* **Config Location**: Root `railway.json` points to the `AI/` subdirectory and runs the build using the `AI/Dockerfile` container.
* **Environment Configuration**: Automatically listens on the system-allocated `PORT` (defaults to `8080` otherwise).
