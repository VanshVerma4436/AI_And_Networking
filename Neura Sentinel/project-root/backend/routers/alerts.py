from fastapi import APIRouter
from database.crud import get_alerts

router = APIRouter()

@router.get("/")
async def fetch_alerts():
    return await get_alerts()

