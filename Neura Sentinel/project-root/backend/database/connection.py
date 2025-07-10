from pymongo import MongoClient
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection settings
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "traffic_db"

# Initialize MongoDB client
client = None

def get_database():
    global client
    try:
        if client is None:
            client = MongoClient(MONGO_URI)
            logger.info("Connected to MongoDB")
        # Test connection
        client.admin.command('ping')
        return client[DATABASE_NAME]
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise
