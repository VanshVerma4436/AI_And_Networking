import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Paths to model and dataset (relative to project-root)
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml_models')
MODEL_PATH = os.path.join(MODEL_DIR, 'classifier.pkl')
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'cleaned_cicids2017.csv')

# Ensure the ml_models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

def train_model():
    """Train the Random Forest model and save it using pickle."""
    # Load the dataset
    data = pd.read_csv(DATASET_PATH)

    # Clean column names (just in case)
    data.columns = data.columns.str.strip()

    # Select features and target
    features = [
        'Flow Duration',
        'Total Fwd Packets',
        'Total Backward Packets',
        'Total Length of Fwd Packets',
        'Total Length of Bwd Packets'
    ]
    X = data[features]
    y = data['Label']

    # Encode the target labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy: {accuracy:.4f}")

    # Save the model and label encoder together using pickle
    model_data = {'model': model, 'label_encoder': le}
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model_data, f)
    print(f"Model and label encoder saved to {MODEL_PATH}")

    return model, le

# Load the model and label encoder
model_data = None
model = None
label_encoder = None
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model_data = pickle.load(f)
    model = model_data['model']
    label_encoder = model_data['label_encoder']
else:
    print("Model file not found. Training new model...")
    model, label_encoder = train_model()

def classify(features):
    """
    Classify a feature set using the trained model.
    Args:
        features (dict): Features extracted from a packet (e.g., {'Flow Duration': ..., ...})
    Returns:
        str: Predicted label (e.g., 'BENIGN', 'DoS Hulk')
    """
    if model is None or label_encoder is None:
        raise ValueError("Model or label encoder not loaded. Run train_model() first.")
    
    # Define the feature order
    feature_order = [
        'Flow Duration',
        'Total Fwd Packets',
        'Total Backward Packets',
        'Total Length of Fwd Packets',
        'Total Length of Bwd Packets'
    ]

    # Ensure the input is a DataFrame with correct column names
    df = pd.DataFrame([[features[col] for col in feature_order]], columns=feature_order)

    # Predict and decode the label
    prediction = model.predict(df)[0]
    label = label_encoder.inverse_transform([prediction])[0]
    return label

if __name__ == "__main__":
    # Test the module by training the model
    train_model()
