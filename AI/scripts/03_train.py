import os
import json
import shutil
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, Callback
from sklearn.utils.class_weight import compute_class_weight
from PIL import ImageFile
import time

# Fix for "OSError: image file is truncated" during Keras data generation
ImageFile.LOAD_TRUNCATED_IMAGES = True

# --- Configuration ---
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_DIR = os.path.join(BASE_DIR, 'data', 'training')
TEST_DIR = os.path.join(BASE_DIR, 'data', 'evaluation')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

# Categories ordered: FASTEST → SLOWEST
CATEGORIES = ["bread", "dairy", "meat", "produce"]

# High-Intensity Training Config (30+ hours target)
EPOCH_CONFIG = {
    "bread":   {"stage1": 50,  "stage2": 100}, 
    "dairy":   {"stage1": 50,  "stage2": 100}, 
    "meat":    {"stage1": 50,  "stage2": 100},  
    "produce": {"stage1": 30,  "stage2": 50},  # Larger datasets need fewer epochs but more time
    "general": {"stage1": 30,  "stage2": 50},  
}

def prepare_data():
    """Handles the 10% test split and Bread data capping."""
    print("\nPreparing data (Splitting 10% for testing and balancing bread)...")
    
    # 1. 10% Test Split
    if os.path.exists(TEST_DIR):
        print(f"Test split already exists at {TEST_DIR}. Skipping movement to prevent data loss.")
    else:
        os.makedirs(TEST_DIR, exist_ok=True)
        for cat in CATEGORIES:
            cat_path = os.path.join(DATA_DIR, cat)
            if not os.path.exists(cat_path): continue
            
            for state in os.listdir(cat_path):
                state_path = os.path.join(cat_path, state)
                if not os.path.isdir(state_path): continue
                
                dest_path = os.path.join(TEST_DIR, cat, state)
                os.makedirs(dest_path, exist_ok=True)
                
                files = [f for f in os.listdir(state_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
                test_count = int(len(files) * 0.1)
                
                if test_count > 0:
                    test_files = random.sample(files, test_count)
                    for f in test_files:
                        shutil.move(os.path.join(state_path, f), os.path.join(dest_path, f))

    # 2. Bread Fix: Cap spoiled at 600
    bread_spoiled_path = os.path.join(DATA_DIR, 'bread', 'spoiled')
    if os.path.exists(bread_spoiled_path):
        files = os.listdir(bread_spoiled_path)
        if len(files) > 600:
            print(f"Capping spoiled bread from {len(files)} to 600...")
            to_remove = random.sample(files, len(files) - 600)
            # Move to a backup folder instead of deleting
            backup_dir = os.path.join(BASE_DIR, 'data', 'backup_bread_spoiled')
            os.makedirs(backup_dir, exist_ok=True)
            for f in to_remove:
                shutil.move(os.path.join(bread_spoiled_path, f), os.path.join(backup_dir, f))

class StatsCallback(Callback):
    def __init__(self, stats_path, category):
        super().__init__()
        self.stats_path = stats_path
        self.category = category
        self.start_time = time.time()
        self.load_stats()

    def load_stats(self):
        if os.path.exists(self.stats_path):
            with open(self.stats_path, 'r') as f:
                self.stats = json.load(f)
        else:
            self.stats = {
                "category": self.category,
                "total_training_time_seconds": 0,
                "total_epochs": 0,
                "peak_val_accuracy": 0.0,
                "last_update": ""
            }

    def save_stats(self):
        self.stats["last_update"] = time.strftime("%Y-%m-%d %H:%M:%S")
        with open(self.stats_path, 'w') as f:
            json.dump(self.stats, f, indent=4)

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        # Update time
        current_time = time.time()
        duration = current_time - self.start_time
        self.start_time = current_time
        self.stats["total_training_time_seconds"] += duration
        
        # Update epochs
        self.stats["total_epochs"] += 1
        
        # Update peak accuracy
        val_acc = logs.get('val_accuracy', 0)
        if val_acc > self.stats["peak_val_accuracy"]:
            self.stats["peak_val_accuracy"] = float(val_acc)
            
        self.save_stats()
        
        # Calculate ETR
        avg_time_per_epoch = self.stats["total_training_time_seconds"] / self.stats["total_epochs"]
        
        # Logic to estimate remaining epochs
        # This is a bit complex since there are two stages, but we'll use a rough estimate
        # based on the current stage and config.
        target_epochs = 150 # Total estimate for fish/meat/etc
        remaining_epochs = max(0, target_epochs - self.stats["total_epochs"])
        etr_hours = (remaining_epochs * avg_time_per_epoch) / 3600
        
        total_hours = self.stats["total_training_time_seconds"] / 3600
        print(f"\n[STATS] {self.category.upper()} | Cumulative Time: {total_hours:.2f} hrs | Peak Accuracy: {self.stats['peak_val_accuracy']:.2%} | Est. Remaining: {etr_hours:.1f} hrs")

def train_category(category, override_dir=None):
    print(f"\n{'='*60}\nTraining Model: {category.upper()}\n{'='*60}")
    
    cat_dir = override_dir if override_dir else os.path.join(DATA_DIR, category)
    if not os.path.exists(cat_dir):
        print(f"Directory {cat_dir} not found. Skipping.")
        return

    epochs_s1 = EPOCH_CONFIG.get(category, {}).get("stage1", 10)
    epochs_s2 = EPOCH_CONFIG.get(category, {}).get("stage2", 5)
    
    stats_path = os.path.join(MODELS_DIR, f"stats_{category}.json")
    stats_callback = StatsCallback(stats_path, category)
    
    total_prev_time = stats_callback.stats['total_training_time_seconds'] / 3600
    print(f"Resume Stats: {stats_callback.stats['total_epochs']} epochs already done | {total_prev_time:.2f} hours total.")

    # Clean up empty subdirectories to avoid class mismatches
    for sub in os.listdir(cat_dir):
        sub_path = os.path.join(cat_dir, sub)
        if os.path.isdir(sub_path) and not os.listdir(sub_path):
            os.rmdir(sub_path)

    # 1. Generators with Data Augmentation
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        validation_split=0.2,
        horizontal_flip=True,
        rotation_range=20,
        zoom_range=0.15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        brightness_range=[0.8, 1.2]
    )

    # Validation generator (No augmentation, only preprocessing)
    val_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        cat_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    val_generator = val_datagen.flow_from_directory(
        cat_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    if train_generator.samples == 0:
        print(f"No training data for {category}. Skipping.")
        return

    # 2. Class Weights for imbalance
    labels = train_generator.classes
    unique_classes = np.unique(labels)
    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=unique_classes,
        y=labels
    )
    class_weight_dict = {cls: weight for cls, weight in zip(unique_classes, class_weights)}
    print(f"Class weights for {category}: {class_weight_dict}")

    # Determine checkpoint path
    model_filename = 'spoilage_model.h5' if category == 'general' else f'spoilage_{category}.h5'
    checkpoint_path = os.path.join(MODELS_DIR, model_filename)
    
    # --- AUTO-RESUME LOGIC ---
    model = None
    if os.path.exists(checkpoint_path):
        try:
            print(f"\n[RESUME] Found existing model for {category} at {model_filename}")
            model = tf.keras.models.load_model(checkpoint_path)
            print(f"[RESUME] Successfully loaded weights. Continuing training...")
        except Exception as e:
            print(f"[WARNING] Could not load existing model: {e}. Starting from scratch.")

    if model is None:
        print(f"\n[NEW] Starting fresh training for {category}...")
        # 3. Model Architecture (MobileNetV2 Transfer Learning)
        base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        base_model.trainable = False

        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dense(128, activation='relu')(x)
        x = Dropout(0.5)(x)
        predictions = Dense(train_generator.num_classes, activation='softmax')(x)

        model = Model(inputs=base_model.input, outputs=predictions)
        print("[NEW] MobileNetV2 base initialized with frozen layers.")
    
    # Save label mappings
    label_file = 'class_indices.json' if category == 'general' else f'labels_{category}.json'
    with open(os.path.join(MODELS_DIR, label_file), 'w') as f:
        json.dump(train_generator.class_indices, f)

    # 4. Training Stage 1: Frozen Base Model
    # Only run Stage 1 if the model isn't already fine-tuned
    is_fine_tuned = False
    for layer in model.layers:
        if isinstance(layer, Model) and layer.trainable:
            # Check if this is the MobileNet base and if it's unfrozen
            if 'mobilenet' in layer.name.lower():
                is_fine_tuned = True
                break
            
    if not is_fine_tuned:
        print(f"\n[STAGE 1] Training top layers (Frozen base) for {category}...")
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        
        callbacks = [
            EarlyStopping(patience=8, restore_best_weights=True),
            ModelCheckpoint(checkpoint_path, save_best_only=True),
            stats_callback
        ]

        model.fit(
            train_generator,
            epochs=epochs_s1,
            validation_data=val_generator,
            class_weight=class_weight_dict,
            callbacks=callbacks
        )
    else:
        print(f"\n[SKIP] Stage 1 already completed for {category}. Skipping to Fine-tuning.")

    # 5. Training Stage 2: Fine-tuning (Unfreezing last 40 layers)
    print(f"\n[STAGE 2] Fine-tuning (Unfreezing last 40 layers) for {category}...")
    
    # Ensure the base model part is unfrozen for fine-tuning
    for layer in model.layers:
        if 'mobilenet' in layer.name.lower():
            layer.trainable = True
            for sub_layer in layer.layers[:-40]:
                sub_layer.trainable = False
            break
        
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    callbacks = [
        EarlyStopping(patience=10, restore_best_weights=True),
        ModelCheckpoint(checkpoint_path, save_best_only=True),
        stats_callback
    ]

    model.fit(
        train_generator,
        epochs=epochs_s2,
        validation_data=val_generator,
        class_weight=class_weight_dict,
        callbacks=callbacks
    )
    
    # Final save
    model.save(checkpoint_path)
    print(f"Completed/Saved training for {category}.")

def train_general():
    """Train the general model using ALL organized_new images combined."""
    print(f"\n{'='*60}\nTraining Model: GENERAL (all categories combined)\n{'='*60}")

    # Build a temporary merged directory view using symlinks is complex on Windows,
    # so instead we point the generator at the organized_new root but flatten it
    # by collecting all images into a two-class temp structure: fresh vs spoiled.
    import tempfile, shutil as _shutil

    tmp_dir = os.path.join(BASE_DIR, 'data', 'tmp_general')
    fresh_dir = os.path.join(tmp_dir, 'fresh')
    spoiled_dir = os.path.join(tmp_dir, 'spoiled')

    if not os.path.exists(tmp_dir):
        print("Building combined dataset for general model...")
        os.makedirs(fresh_dir, exist_ok=True)
        os.makedirs(spoiled_dir, exist_ok=True)

        for cat in os.listdir(DATA_DIR):
            cat_path = os.path.join(DATA_DIR, cat)
            if not os.path.isdir(cat_path): continue
            for state in ['fresh', 'spoiled']:
                state_path = os.path.join(cat_path, state)
                if not os.path.exists(state_path): continue
                dest = fresh_dir if state == 'fresh' else spoiled_dir
                for f in os.listdir(state_path):
                    src = os.path.join(state_path, f)
                    dst = os.path.join(dest, f"{cat}_{f}")
                    _shutil.copy2(src, dst)
        print(f"General dataset built: {len(os.listdir(fresh_dir))} fresh, {len(os.listdir(spoiled_dir))} spoiled")
    else:
        print(f"Reusing existing combined dataset at {tmp_dir}")

    train_category("general", override_dir=tmp_dir)


def main():
    os.makedirs(MODELS_DIR, exist_ok=True)
    prepare_data()
    for cat in CATEGORIES:
        train_category(cat)
    train_general()

if __name__ == "__main__":
    main()
