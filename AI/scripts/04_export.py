import os
import tensorflow as tf
import tf2onnx
import onnx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def convert_to_onnx(model_path, output_path):
    if not os.path.exists(model_path):
        logger.warning(f"Model {model_path} not found.")
        return

    logger.info(f"Loading Keras model from {model_path}...")
    model = tf.keras.models.load_model(model_path)
    
    spec = (tf.TensorSpec((None, 224, 224, 3), tf.float32, name="input"),)
    
    logger.info("Converting to ONNX...")
    model_proto, _ = tf2onnx.convert.from_keras(model, input_signature=spec, opset=13)
    
    onnx.save(model_proto, output_path)
    logger.info(f"Model saved to {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, 'models')
    
    for filename in os.listdir(models_dir):
        if filename.endswith(('.keras', '.h5')):
            model_path = os.path.join(models_dir, filename)
            output_path = model_path.replace('.keras', '.onnx').replace('.h5', '.onnx')
            convert_to_onnx(model_path, output_path)
