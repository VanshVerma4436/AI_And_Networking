from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel
from database.crud import get_recent_traffic
from database.connection import get_database
from services.Train_ML_Model.train_model import classify
from utils.websocket_manager import connected_clients
import asyncio
import logging
import time

router = APIRouter()
logger = logging.getLogger(__name__)

class Features(BaseModel):
    Flow_Duration: float
    Total_Fwd_Packets: int
    Total_Backward_Packets: int
    Total_Length_of_Fwd_Packets: int
    Total_Length_of_Bwd_Packets: int

@router.post("/classify")
async def classify_traffic(features: Features):
    try:
        feature_dict = {
            'Flow Duration': features.Flow_Duration,
            'Total Fwd Packets': features.Total_Fwd_Packets,
            'Total Backward Packets': features.Total_Backward_Packets,
            'Total Length of Fwd Packets': features.Total_Length_of_Fwd_Packets,
            'Total Length of Bwd Packets': features.Total_Length_of_Bwd_Packets
        }

        logger.info(f"Received features: {feature_dict}")

        # Run classification
        loop = asyncio.get_event_loop()
        label = await loop.run_in_executor(None, classify, feature_dict)

        logger.info(f"Predicted label: {label}")

        # Save to DB
        db = get_database()
        collection = db["classified_traffic"]
        result = {**feature_dict, "label": label, "timestamp": time.time()}
        collection.insert_one(result)

        # Prepare payload for WebSocket clients
        payload = {
            "fwd": feature_dict['Total Fwd Packets'],
            "bwd": feature_dict['Total Backward Packets'],
            "label": label,
            "timestamp": result["timestamp"]
        }

        # Safe broadcast to clients
        for client in connected_clients[:]:
            try:
                await client.send_json(payload)
            except Exception as e:
                logger.warning(f"Failed to send to client: {e}")
                connected_clients.remove(client)

        return {"label": label}

    except Exception as e:
        logger.error(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/")
async def fetch_traffic():
    return await get_recent_traffic()

# Optional: Legacy websocket loop, can be removed if you're broadcasting from /classify
@router.websocket("/ws/traffic")
async def websocket_traffic(websocket: WebSocket):
    await websocket.accept()
    db = get_database()
    collection = db["classified_traffic"]

    try:
        while True:
            latest = collection.find().sort("timestamp", -1).limit(1)
            for doc in latest:
                await websocket.send_json({
                    "fwd": doc.get("Total Fwd Packets", 0),
                    "bwd": doc.get("Total Backward Packets", 0),
                    "label": doc.get("label", "BENIGN"),
                    "timestamp": doc.get("timestamp", time.time())
                })
            await asyncio.sleep(1)
    except Exception as e:
        logger.warning(f"WebSocket traffic loop error: {e}")
