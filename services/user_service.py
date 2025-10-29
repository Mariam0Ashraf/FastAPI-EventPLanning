from repositories.user_repository import createUser, usersCollection
from core.security import hashPassword

async def findUserByEmail(email: str):
    return await usersCollection.find_one({"email": email})

async def registerUser(username: str, email: str, password: str):
    existingUser = await findUserByEmail(email)
    if existingUser:
        return {"error": "User already exists"}
    try:
        hashedPass = hashPassword(password)
        userData = {"username": username, "email": email, "password": hashedPass  }
        newUser = await createUser(userData)
        return newUser
    except Exception :
        return {"error": "Failed to register user"}
