from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional
from bson import ObjectId
from typing_extensions import Annotated  # Use this for broad compatibility



class User(BaseModel):

    id: Optional[Annotated[str, BeforeValidator(str)]] = Field(
        alias="_id", default=None
    )

    username: str
    email: str
    password: str

    class Config:
        populate_by_name = True


        json_encoders = {
            ObjectId: str
        }