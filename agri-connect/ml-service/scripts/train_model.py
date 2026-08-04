import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os
import urllib.request
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
DATA_URL = "https://raw.githubusercontent.com/Gladiator07/Harvestify/master/Data-processed/crop_recommendation.csv"
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "crop_recommendation.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

def download_data():
    if not os.path.exists(DATA_PATH):
        logger.info(f"Downloading dataset from {DATA_URL}...")
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
        urllib.request.urlretrieve(DATA_URL, DATA_PATH)
        logger.info("Dataset downloaded successfully.")
    else:
        logger.info("Dataset already exists locally.")

def train():
    logger.info("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    # Check if there are any missing values
    if df.isnull().sum().any():
        logger.warning("Missing values found in the dataset. Dropping them.")
        df = df.dropna()

    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    logger.info("Encoding labels...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    logger.info(f"Unique crops found: {len(le.classes_)}")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    logger.info("Training RandomForestClassifier...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)

    score = rf.score(X_test, y_test)
    logger.info(f"Model trained! Test Accuracy: {score:.4f}")

    logger.info("Saving model and encoder...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(rf, MODEL_PATH)
    joblib.dump(le, ENCODER_PATH)
    logger.info(f"Saved model to {MODEL_PATH}")
    logger.info(f"Saved encoder to {ENCODER_PATH}")

if __name__ == "__main__":
    download_data()
    train()
    logger.info("Training pipeline completed successfully.")
