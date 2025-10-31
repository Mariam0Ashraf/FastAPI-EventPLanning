from core.config import db
from models.user import User

usersCollection = db["users"]


async def findUserByEmail(email: str):
    # 1. Await and retrieve the data
    user_dict = await usersCollection.find_one({"email": email})

    # 2. Check if the user was found (i.e., if user_dict is not None)
    if user_dict:
        # 3. Safely map the dictionary to the Pydantic model using **
        return User(**user_dict)

    # 4. If not found, return None (or handle the error)
    return None


async def createUser(userData: dict):
    result = await usersCollection.insert_one(userData)
    newUser = await usersCollection.find_one({"_id": result.inserted_id})
    return User(**newUser)
