import os
import subprocess
import sys
import time

# --- Configuration ---
SCRIPTS = [
    "01_download.py",
    "02_organize.py",
    "03_train.py",
    "04_export.py",
    "05_evaluate.py"
]

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(BASE_DIR, 'scripts')
KAGGLE_JSON = os.path.join(BASE_DIR, 'kaggle.json')

def check_prerequisites():
    """Check if everything needed is in place."""
    print("Checking prerequisites...")
    if not os.path.exists(KAGGLE_JSON):
        print(f"WARNING: kaggle.json not found at {KAGGLE_JSON}")
        print("Step 01_download.py may fail if KAGGLE_USERNAME/KAGGLE_KEY are not in environment.")
    
    # Check for venv/dependencies (optional but good)
    try:
        import tensorflow as tf
        print(f"TensorFlow found: {tf.__version__}")
    except ImportError:
        print("ERROR: TensorFlow not found. Please run 'pip install -r requirements.txt' first.")
        return False
    
    return True

def run_script(script_name):
    """Run a python script and wait for it to finish."""
    script_path = os.path.join(SCRIPTS_DIR, script_name)
    if not os.path.exists(script_path):
        print(f"ERROR: Script {script_name} not found at {script_path}")
        return False

    print(f"\n{'-'*60}")
    print(f"RUNNING: {script_name}")
    print(f"{'-'*60}")
    
    start_time = time.time()
    try:
        # Use sys.executable to ensure we use the same venv
        result = subprocess.run([sys.executable, script_path], check=True)
        elapsed = time.time() - start_time
        print(f"SUCCESS: {script_name} finished in {elapsed/60:.2f} minutes.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"FAILED: {script_name} exited with error code {e.returncode}")
        return False

def main():
    print("="*60)
    print(" WASTE2TASTE AI PIPELINE CONTROLLER")
    print("="*60)
    print("This script will run the full end-to-end process:")
    print("1. Download Datasets (Kaggle)")
    print("2. Organize Data (Category-based mapping)")
    print("3. Train Models (MobileNetV2 Transfer Learning)")
    print("4. Export to ONNX (Optimized Inference)")
    print("5. Evaluate Results (Performance Metrics)")
    print("-" * 60)
    print("NEW: Training is now RESUMABLE. You can Ctrl+C anytime and restart.")
    print("Estimated total time: 24-48 hours for deep training.")
    print("="*60)

    if not check_prerequisites():
        sys.exit(1)

    input("\nPress ENTER to start the pipeline or Ctrl+C to cancel...")

    for script in SCRIPTS:
        if not run_script(script):
            print(f"\nPipeline halted at {script}. Fix the error and restart.")
            sys.exit(1)

    print("\n" + "="*60)
    print(" FULL PIPELINE COMPLETED SUCCESSFULLY!")
    print(" Models are ready in the /models directory.")
    print("="*60)

if __name__ == "__main__":
    main()
