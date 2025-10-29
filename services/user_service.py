from repositories.user_repository import createUser
from core.security import hashPassword

async def registerUser(username: str, email: str, password: str):
    hashedPass = hashPassword(password)
    userData = {"username": username, "email": email, "password": hashedPass  }
    newUser = await createUser(userData)
    return newUser
