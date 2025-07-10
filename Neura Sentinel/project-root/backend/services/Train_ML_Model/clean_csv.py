import pandas as pd
import os

# Path to the combined dataset
DATASET_PATH = r"C:\Users\Vansh Verma\Desktop\NEURA\project-root\combined_cicids2017.csv"
CLEANED_DATASET_PATH = r"C:\Users\Vansh Verma\Desktop\NEURA\project-root\cleaned_cicids2017.csv"

# Load the combined dataset
print("Loading combined dataset...")
df = pd.read_csv(DATASET_PATH)

# Step 1: Clean column names
df.columns = df.columns.str.strip()

# Step 2: Check for required columns
required_columns = [
    'Flow Duration',
    'Total Fwd Packets',
    'Total Backward Packets',
    'Total Length of Fwd Packets',
    'Total Length of Bwd Packets',
    'Label'
]
missing_columns = [col for col in required_columns if col not in df.columns]
if missing_columns:
    raise ValueError(f"Missing required columns: {missing_columns}")

# Step 3: Handle missing values
print("Handling missing values...")
# Replace 'Infinity' or 'inf' with NaN
df.replace(['Infinity', 'inf', 'INF'], float('nan'), inplace=True)
# Drop rows with NaN in required columns
df.dropna(subset=required_columns, inplace=True)

# Step 4: Convert numeric columns to appropriate types
numeric_columns = [
    'Flow Duration',
    'Total Fwd Packets',
    'Total Backward Packets',
    'Total Length of Fwd Packets',
    'Total Length of Bwd Packets'
]
for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')
# Drop any rows where numeric conversion failed
df.dropna(subset=numeric_columns, inplace=True)

# Step 5: Remove duplicates
print("Removing duplicates...")
df.drop_duplicates(inplace=True)

# Step 6: Save the cleaned dataset
print("Saving cleaned dataset...")
df.to_csv(CLEANED_DATASET_PATH, index=False)
print(f"Cleaned dataset saved to {CLEANED_DATASET_PATH}")

# Summary
print("Dataset cleaning summary:")
print(f"Total rows after cleaning: {len(df)}")
print(f"Labels distribution:\n{df['Label'].value_counts()}")