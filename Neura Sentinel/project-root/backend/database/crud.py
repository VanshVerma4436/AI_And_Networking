from database.connection import get_database

async def insert_traffic(data):
    db = get_database()
    await db.traffic.insert_one(data)

async def get_recent_traffic():
    db = get_database()
    return await db.traffic.find().sort("timestamp", -1).to_list(100)

async def get_alerts():
    db = get_database()
    return await db.alerts.find().sort("timestamp", -1).to_list(50)
