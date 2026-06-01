import requests
import sys
import os

def test_prediction(image_path):
    url = "http://127.0.0.1:8000/predict"
    
    if not os.path.exists(image_path):
        print(f"Error: File {image_path} not found.")
        return

    print(f"Sending {image_path} to API...")
    
    with open(image_path, "rb") as f:
        files = {"file": (image_path, f, "image/jpeg")}
        try:
            response = requests.post(url, files=files)
            if response.status_code == 200:
                result = response.json()
                print("\n--- Prediction Result ---")
                print(f"Label:      {result['prediction']}")
                print(f"Confidence: {result['confidence']:.2%}")
                print(f"Spoiled %:  {result['spoiled_percentage']}%")
                print(f"Is Spoiled: {result['is_spoiled']}")
                print("-------------------------")
            else:
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Failed to connect to API: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_api.py <path_to_image>")
        # Try to find a sample image in the dataset to make it easier
        sample_path = "data/training/general/fresh"
        if os.path.exists(sample_path):
            samples = [os.path.join(sample_path, f) for f in os.listdir(sample_path) if f.endswith(('.jpg', '.png'))]
            if samples:
                print(f"No image provided. Testing with sample: {samples[0]}")
                test_prediction(samples[0])
    else:
        test_prediction(sys.argv[1])
