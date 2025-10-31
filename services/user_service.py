import logging

from repositories.user_repository import createUser, findUserByEmail
from core.security import hashPassword, checkPassword


async def registerUser(username: str, email: str, password: str):
    existingUser = await findUserByEmail(email)
    if existingUser:
        return {"error": "User already exists"}
    try:
        hashedPass = hashPassword(password)
        userData = {"username": username, "email": email, "password": hashedPass}
        newUser = await createUser(userData)
        return newUser
    except Exception as e:
        logging.error(f"An error occurred: {e}", exc_info=True)
        return {"error": "Failed to register user"}


async def loginUser(email: str, password: str):
    user = await findUserByEmail(email)
    if not user:
        return {"error": "User Not Found", "code": 404}
    elif checkPassword(password=password, hashed_password=user.password):
        return {"user": user}
    else:
        return {"error": "These credentials do not match our records", "code": 400}

