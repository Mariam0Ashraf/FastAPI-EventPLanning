from pydantic import BaseModel

class CreateEventRequest(BaseModel):
    title: str
    date: str
    time: str
    location: str
    description: str

class InviteUserRequest(BaseModel):
    event_id: str
    email: str