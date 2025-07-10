import pandas as pd
import os

# Path to the folder containing the CSV files (now in Train_ML_Model\MachineLearningCVE)
folder_path = r"C:\Users\Vansh Verma\Desktop\NEURA\project-root\backend\services\Train_ML_Model\MachineLearningCVE"

# List to store all DataFrames
all_dataframes = []

# Loop through all CSV files in the folder
for file_name in os.listdir(folder_path):
    if file_name.endswith('.csv'):
        print(f"Reading {file_name}...")
        file_path = os.path.join(folder_path, file_name)
        try:
            df = pd.read_csv(file_path, encoding='latin1')
            all_dataframes.append(df)
        except Exception as e:
            print(f"Error reading {file_name}: {e}")

# Combine all DataFrames
if all_dataframes:
    combined_df = pd.concat(all_dataframes, ignore_index=True)
    # Save the combined DataFrame to project-root
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(folder_path)))), 'combined_cicids2017.csv')
    combined_df.to_csv(output_path, index=False)
    print(f"Combined CSV saved as '{output_path}'")
else:
    print("No CSV files found to combine.")