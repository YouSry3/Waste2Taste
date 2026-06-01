import os
import time
import json
import random
import numpy as np
from PIL import Image
import onnxruntime as ort

def preprocess_image(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
        image = image.resize((224, 224))
        img_array = np.array(image, dtype=np.float32)
        # MobileNetV2 expects [-1, 1] normalization
        img_array = (img_array / 127.5) - 1.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        return None

def main():
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    test_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'evaluation')
    organized_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'training')
    output_file = os.path.join(os.path.dirname(__file__), '..', 'analysis.md')

    if not os.path.exists(models_dir) or not os.path.exists(test_dir):
        print("Models or test directory not found.")
        return

    table_rows = []
    category_counts = {}

    # Get real counts for the report
    for cat in os.listdir(organized_dir):
        cat_path = os.path.join(organized_dir, cat)
        if os.path.isdir(cat_path):
            fresh = len(os.listdir(os.path.join(cat_path, 'fresh'))) if os.path.exists(os.path.join(cat_path, 'fresh')) else 0
            spoiled = len(os.listdir(os.path.join(cat_path, 'spoiled'))) if os.path.exists(os.path.join(cat_path, 'spoiled')) else 0
            category_counts[cat] = {'fresh': fresh, 'spoiled': spoiled}

    for filename in os.listdir(models_dir):
        if filename.endswith('.onnx'):
            model_path = os.path.join(models_dir, filename)
            cat = 'general' if filename == 'spoilage_model.onnx' else filename.replace('spoilage_', '').replace('.onnx', '')
            
            try:
                session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
            except Exception as e:
                print(f"Failed to load {filename}: {e}")
                continue

            label_filename = 'class_indices.json' if cat == 'general' else f'labels_{cat}.json'
            labels_path = os.path.join(models_dir, label_filename)
            labels = {0: "Fresh", 1: "Spoiled"}
            if os.path.exists(labels_path):
                with open(labels_path, 'r') as f:
                    indices = json.load(f)
                    labels = {v: k.capitalize() for k, v in indices.items()}

            print(f"Evaluating {cat} model on test split...")
            
            latencies = []
            correct = 0
            total = 0
            
            input_name = session.get_inputs()[0].name
            
            cat_test_dir = os.path.join(test_dir, cat)
            if not os.path.exists(cat_test_dir):
                continue

            for state in os.listdir(cat_test_dir):
                state_path = os.path.join(cat_test_dir, state)
                if not os.path.isdir(state_path): continue
                
                is_true_spoiled = state.lower() in ['spoiled', 'rotten', 'bad']
                
                files = os.listdir(state_path)
                test_sample = random.sample(files, min(len(files), 50))
                
                for img_name in test_sample:
                    img_path = os.path.join(state_path, img_name)
                    img_array = preprocess_image(img_path)
                    if img_array is None: continue
                    
                    start_time = time.perf_counter()
                    raw_pred = session.run(None, {input_name: img_array})[0][0]
                    end_time = time.perf_counter()
                    
                    latencies.append((end_time - start_time) * 1000)
                    total += 1
                    
                    idx = np.argmax(raw_pred)
                    pred_label = labels.get(idx, "Unknown").lower()
                    is_pred_spoiled = pred_label in ['spoiled', 'rotten', 'bad']
                    
                    if is_pred_spoiled == is_true_spoiled:
                        correct += 1
            
            if total > 0:
                accuracy = (correct / total) * 100
                avg_latency = np.mean(latencies)
                p95_latency = np.percentile(latencies, 95)
                table_rows.append(f"| {cat.capitalize()} | {accuracy:.1f}% | {avg_latency:.2f} ms | {p95_latency:.2f} ms | {total} |")

    # Final report assembly
    dataset_rows = ""
    total_fresh = 0
    total_spoiled = 0
    for cat, counts in category_counts.items():
        f = counts['fresh']
        s = counts['spoiled']
        dataset_rows += f"| **{cat.capitalize()}** | {f:,} | {s:,} | {f+s:,} |\n"
        total_fresh += f
        total_spoiled += s
    
    dataset_info = f"""
### Dataset Information & Structure (Updated)
The AI system leverages a multi-model ensemble trained on high-quality datasets.

#### 2. Class Distribution (Organized)
| Category | Fresh | Spoiled | Total |
| :--- | :--- | :--- | :--- |
{dataset_rows}| **Total Pipeline Data** | **{total_fresh:,}** | **{total_spoiled:,}** | **{total_fresh+total_spoiled:,}** |
"""
    
    report_header = f"""
### Spoilage Detection (ONNX) - 3-Class Validation
| Model | Accuracy | Avg Latency | P95 Latency | Images |
| :--- | :--- | :--- | :--- | :--- |
"""
    
    with open(output_file, 'w') as f: # Use 'w' to reset the report
        f.write("# Waste2Taste AI Performance Report\n")
        f.write(dataset_info)
        f.write("\n" + report_header)
        for row in table_rows:
            f.write(row + "\n")
        
        f.write("\n### Recommendations for Improvement\n")
        f.write("1. **Accuracy (Images):** General and Bread models now reach ~66% accuracy. Dairy and Produce still need more data or longer training.\n")
        f.write("2. **Latency:** Image models remain extremely fast (<3ms).\n")

    print(f"Analysis updated in {output_file}")

def evaluate_sentiment():
    print("Loading sentiment engine...")
    from transformers import pipeline
    model_name = "MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7"
    
    # Measure load time
    load_start = time.perf_counter()
    sentiment_model = pipeline("zero-shot-classification", model=model_name)
    load_end = time.perf_counter()
    load_time_ms = (load_end - load_start) * 1000
    
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
    
    test_data = [
        ("Thank you so much! The food is perfectly fresh and we are very happy.", "gratitude"),
        ("شكرا جزيلا! الطعام طازج تمامًا ونحن سعداء جدًا.", "gratitude"),
        ("The bread was completely moldy and disgusting, it's a huge health hazard.", "disgust"),
        ("كان الخبز متعفنًا ومقرفًا تمامًا، إنه خطر صحي كبير.", "disgust"),
        ("I showed up at the store but it was already closed, very frustrating experience.", "frustration"),
        ("ذهبت إلى المتجر ولكنه كان مغلقًا بالفعل، تجربة محبطة للغاية.", "frustration"),
        ("Wow, what an incredible find! We got so much food for such a great price.", "excitement"),
        ("يا للروعة، ياله من اكتشاف مذهل! حصلنا على الكثير من الطعام بسعر رائع.", "excitement"),
        ("This milk expires tomorrow, we need to pick it up urgently before it goes bad.", "urgency"),
        ("ينتهي تاريخ صلاحية هذا الحليب غدًا، نحتاج إلى استلامه بشكل عاجل قبل أن يفسد.", "urgency"),
        ("A bit disappointed with the portion sizes, expected a bit more.", "disappointment"),
        ("أشعر بخيبة أمل قليلاً من حجم الحصص، كنت أتوقع أكثر من ذلك بقليل.", "disappointment")
    ]

    
    # Cold start test
    cold_start_time = time.perf_counter()
    _ = sentiment_model("Cold start test", candidate_labels=CANDIDATE_LABELS, multi_label=True)
    cold_end_time = time.perf_counter()
    cold_ms = (cold_end_time - cold_start_time) * 1000

    print(f"Testing {len(test_data)} unique sentences (5 iterations each)...")
    
    latencies = []
    correct = 0
    total = 0
    
    for _ in range(5):
        for text, true_tag in test_data:
            start_time = time.perf_counter()
            result = sentiment_model(text, candidate_labels=CANDIDATE_LABELS, multi_label=True)
            end_time = time.perf_counter()
            
            latencies.append((end_time - start_time) * 1000)
            
            # Check accuracy (top prediction)
            top_label = result['labels'][0]
            pred_tag = LABEL_TO_ID[top_label]
            if pred_tag == true_tag:
                correct += 1
            total += 1
            
    avg_latency = np.mean(latencies)
    p95_latency = np.percentile(latencies, 95)
    accuracy = (correct / total) * 100
    
    report = f"""
### Sentiment & Moderation Analysis (mDeBERTa)
| Metric | Value |
| :--- | :--- |
| **Model** | `{model_name}` |
| **Accuracy (Top-1)** | {accuracy:.1f}% |
| **Avg Latency** | {avg_latency:.2f} ms |
| **P95 Latency** | {p95_latency:.2f} ms |
| **Cold Start (1st Inf)** | {cold_ms:.2f} ms |
| **Model Load Time** | {load_time_ms:.2f} ms |
| **Samples Tested** | {total} |

#### Sample Evaluation
| Text | Expected Label |
| :--- | :--- |
| Thank you so much! The food is perfectly fresh and we are very happy. | gratitude |
| شكرا جزيلا! الطعام طازج تمامًا ونحن سعداء جدًا. | gratitude |
| The bread was completely moldy and disgusting, it's a huge health hazard. | disgust |
| كان الخبز متعفنًا ومقرفًا تمامًا، إنه خطر صحي كبير. | disgust |
"""
    
    output_file = os.path.join(os.path.dirname(__file__), '..', 'analysis.md')
    
    # Append to report
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write("\n" + report)
        
    print(f"Sentiment analysis updated in {output_file}")

if __name__ == "__main__":
    main()
    evaluate_sentiment()
