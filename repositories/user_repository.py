from core.config import db

usersCollection = db["users"]

async def createUser(userData: dict):
    result = await usersCollection.insert_one(userData)
    newUser = await usersCollection.find_one({"_id": result.inserted_id})
    return newUser
