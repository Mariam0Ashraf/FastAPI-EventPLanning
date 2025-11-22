from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional
from bson import ObjectId
from typing_extensions import Annotated


class Event(BaseModel):
    id: Optional[Annotated[str, BeforeValidator(str)]] = Field(alias="_id", default=None)

    title: str
    date: str
    time: str
    location: str
    description: str

    created_by: str
    invited_users: List[str] = []

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
