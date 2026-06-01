import os
import json
import shutil
import kagglehub
import pathlib

# Configuration
KAGGLE_CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'kaggle.json')
DATASET_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dataset')

# Datasets to download (Synced with data/notes.md)
# Format: (dataset_handle, target_folder_name)
DATASETS = [
    ("sriramr/fruits-fresh-and-rotten-for-classification", "raw_fruits"),
    ("nirmalsankalana/food-freshness-dataset", "food-freshness-dataset"),
    ("crowww/meat-quality-assessment-based-on-deep-learning", "meat-quality"),
    # Note: fresh-and-spoiled-food-image-dataset is a direct download and not available via Kaggle API
]

def load_kaggle_credentials():
    """Load credentials from kaggle.json and set environment variables."""
    if os.path.exists(KAGGLE_CONFIG_PATH):
        try:
            with open(KAGGLE_CONFIG_PATH, 'r') as f:
                data = json.load(f)
                os.environ['KAGGLE_USERNAME'] = data.get('username', '')
                os.environ['KAGGLE_KEY'] = data.get('key', '')
                print(f"Loaded credentials for user: {data.get('username')}")
        except Exception as e:
            print(f"Error loading kaggle.json: {e}")
    else:
        print(f"Warning: {KAGGLE_CONFIG_PATH} not found. Assuming environment variables are set.")

    if not os.environ.get('KAGGLE_USERNAME') or not os.environ.get('KAGGLE_KEY'):
        print("ERROR: Kaggle credentials not found. Please set KAGGLE_USERNAME and KAGGLE_KEY environment variables or create 'kaggle.json'.")
        return False
    return True

def organize_datasets(download_path, dataset_name):
    """
    Organize downloaded data into a unified structure:
    dataset/train/fresh
    dataset/train/rotten
    dataset/test/fresh
    dataset/test/rotten
    """
    # This logic will need to be customized based on the actual structure of the downloaded datasets
    # For now, we will inspect the downloaded path.
    print(f"Dataset {dataset_name} downloaded to: {download_path}")
    
    # We will implement a smarter merger after inspecting the first download
    # For now, let's just copy everything to a temp folder in our repo to inspect
    target_path = os.path.join(DATASET_DIR, dataset_name)
    if os.path.exists(target_path):
        shutil.rmtree(target_path)
    shutil.copytree(download_path, target_path)
    print(f"Copied to: {target_path}")

def main():
    if not load_kaggle_credentials():
        return

    os.makedirs(DATASET_DIR, exist_ok=True)

    for handle, name in DATASETS:
        target_path = os.path.join(DATASET_DIR, name)
        if os.path.exists(target_path):
            print(f"Dataset {name} already exists. Skipping.")
            continue
            
        try:
            print(f"Downloading {handle}...")
            path = kagglehub.dataset_download(handle)
            organize_datasets(path, name)
        except Exception as e:
            print(f"Failed to download {handle}: {e}")

if __name__ == "__main__":
    main()
