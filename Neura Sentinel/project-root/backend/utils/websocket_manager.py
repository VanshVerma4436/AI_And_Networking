# backend/utils/websocket_manager.py
from typing import List
from fastapi import WebSocket

connected_clients: List[WebSocket] = []

def get_connected_clients() -> List[WebSocket]:
    return connected_clients

