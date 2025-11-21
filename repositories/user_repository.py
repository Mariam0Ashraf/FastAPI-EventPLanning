from core.config import db
from models.user import User

usersCollection = db["users"]


async def findUserByEmail(email: str):
    user_dict = await usersCollection.find_one({"email": email})

    if user_dict:
        return User(**user_dict)

    return None


async def createUser(userData: dict):
    result = await usersCollection.insert_one(userData)
    newUser = await usersCollection.find_one({"_id": result.inserted_id})
    return User(**newUser)
