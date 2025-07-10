import pandas as pd

# Path to the combined dataset (absolute path)
DATASET_PATH = r"C:\Users\Vansh Verma\Desktop\NEURA\project-root\combined_cicids2017.csv"

# Load the combined dataset
df = pd.read_csv(DATASET_PATH)

# Strip whitespace from column names
df.columns = df.columns.str.strip()

# Display basic information
print("Dataset Info:")
df.info()
print("\nFirst 5 Rows:")
print(df.head())
print("\nLabel Distribution:")
print(df['Label'].value_counts())