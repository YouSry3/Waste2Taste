import os
import shutil
import json

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIRS = [
    os.path.join(BASE_DIR, 'data', 'raw'),
    os.path.join(BASE_DIR, 'dataset'),
]
ORG_DIR = os.path.join(BASE_DIR, 'data', 'training')

# Categories and States
CATEGORIES = ['bread', 'dairy', 'produce', 'meat', 'fish', 'general']
STATES = ['fresh', 'mid', 'spoiled']

# Mapping Keywords
MAPPING = {
    'produce': ['apple', 'banana', 'orange', 'strawberry', 'mango', 'potato', 'tomato', 'carrot', 'pepper', 'bellpepper', 'cucumber', 'mango', 'cabbage', 'lettuce', 'fruit', 'vegetable', 'onion', 'garlic', 'ginger', 'lemon', 'lime', 'grapes', 'kiwi', 'pineapple', 'watermelon', 'melon', 'peach', 'plum', 'cherry', 'berry', 'corn', 'broccoli', 'cauliflower', 'spinach', 'okra', 'bittergroud', 'capciscum'],
    'bread': ['bread', 'bun', 'toast', 'bakery', 'croissant', 'muffin', 'cake', 'pastry'],
    'dairy': ['dairy', 'milk', 'cheese', 'yogurt', 'curd', 'butter', 'cream'],
    'meat': ['meat', 'beef', 'pork', 'chicken', 'mutton', 'lamb', 'steak', 'sausage', 'ham', 'bacon'],
    'fish': ['fish', 'seafood', 'shrimp', 'prawn', 'crab', 'lobster', 'salmon', 'tuna'],
}

def determine_mapping(path):
    path_lower = path.lower()
    path_parts = path_lower.replace('\\', '/').split('/')
    
    # Determine Category
    category = 'general'
    # Check from deepest folder upwards for category
    for part in reversed(path_parts):
        for cat, keywords in MAPPING.items():
            if any(kw in part for kw in keywords):
                category = cat
                break
        if category != 'general':
            break
            
    # Determine State - check specifically in the last 2 folder levels
    state = 'fresh' # Default
    last_two = " ".join(path_parts[-2:])
    
    if any(kw in last_two for kw in ['rotten', 'mold', 'bad', 'expired', 'nonfresh', 'non_fresh', 'non-fresh']):
        state = 'spoiled'
    elif 'spoil' in last_two:
        state = 'spoiled'
    elif any(kw in last_two for kw in ['stale', 'mid', 'half', 'old']):
        state = 'mid'
    elif any(kw in last_two for kw in ['fresh', 'healthy', 'good']):
        state = 'fresh'
        
    return category, state

def organize():
    print("Starting data organization...")
    
    # Create directories
    for cat in CATEGORIES:
        for state in STATES:
            os.makedirs(os.path.join(ORG_DIR, cat, state), exist_ok=True)
            
    counts = {cat: {state: 0 for state in STATES} for cat in CATEGORIES}
    
    for raw_root in RAW_DIRS:
        if not os.path.exists(raw_root):
            continue
            
        print(f"Scanning {raw_root}...")
        for root, dirs, files in os.walk(raw_root):
            # Skip the organized directory itself if it's inside raw
            if ORG_DIR in root:
                continue
                
            images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            if not images:
                continue
                
            cat, state = determine_mapping(root)
            
            for img in images:
                src = os.path.join(root, img)
                # Create a unique filename based on path to avoid collisions
                rel_path = os.path.relpath(src, raw_root).replace(os.sep, '_')
                dst = os.path.join(ORG_DIR, cat, state, rel_path)
                
                if not os.path.exists(dst):
                    try:
                        shutil.copy2(src, dst)
                        counts[cat][state] += 1
                    except Exception as e:
                        pass
                        
    print("\nOrganization Complete!")
    print(f"{'Category':<15} {'Fresh':<10} {'Mid':<10} {'Spoiled':<10}")
    print("-" * 50)
    for cat in CATEGORIES:
        print(f"{cat:<15} {counts[cat]['fresh']:<10} {counts[cat]['mid']:<10} {counts[cat]['spoiled']:<10}")

if __name__ == "__main__":
    organize()
