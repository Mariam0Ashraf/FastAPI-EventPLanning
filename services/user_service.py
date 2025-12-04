from repositories.user_repository import findUserByEmail, createUser
from core.security import hashPassword, checkPassword
from core.jwt_handler import create_access_token
from repositories.user_repository import findUserById
from bson import ObjectId

import logging


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

    if not checkPassword(password=password, hashed_password=user.password):
        return {"error": "These credentials do not match our records", "code": 400}

    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email
        }
    }

async def getUserByIdService(user_id: str):
    try:
        user_oid = ObjectId(user_id)
    except Exception:
       
        return {"error": "Invalid User ID format", "code": 404}
    
    user = await findUserById(user_id)


    if not user:
        return {"error": "User not found", "code": 404}

    user_dict = user.model_dump()
    user_dict.pop("password", None)

    return user_dict