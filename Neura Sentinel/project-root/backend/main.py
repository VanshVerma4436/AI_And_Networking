from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import logging

from routers import traffic, alerts, user, sniffer
from database.connection import get_database
from utils.websocket_manager import connected_clients

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Neura Sentinel API",
    description="Real-time traffic classification and monitoring backend",
    version="1.0.0"
)

# === Routers ===
app.include_router(sniffer.router, prefix="/sniffer", tags=["Sniffer"])
app.include_router(traffic.router, prefix="/traffic", tags=["Traffic"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(user.router, prefix="/user", tags=["User"])

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === MongoDB connection on startup ===
@app.on_event("startup")
async def startup_event():
    get_database()

# === WebSocket endpoint at /ws/traffic ===
@app.websocket("/ws/traffic")
async def websocket_traffic(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await asyncio.sleep(10)  # Keep-alive ping
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {websocket.client}")
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
