from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "event_planning"
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]


async def checkConnection():
    try:
        connection_str = AsyncIOMotorClient(MONGO_URI)
        await connection_str.server_info()
        return True
    except Exception as e:
        print("MongoDB connection failed ", e)
        return False
