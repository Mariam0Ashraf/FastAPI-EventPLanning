from bson import ObjectId

from core.config import db
from models.event import Event

eventsCollection = db["events"]


async def createEvent(eventData: dict):
    result = await eventsCollection.insert_one(eventData)
    newEvent = await eventsCollection.find_one({"_id": result.inserted_id})
    return Event(**newEvent)


async def findEventsByUser(user_id: str):
    cursor = eventsCollection.find({"created_by": user_id})
    events = []
    async for event in cursor:
        events.append(Event(**event))
    return events

async def deleteEventById(event_id: str, user_id: str):
    result = await eventsCollection.delete_one({
        "_id": ObjectId(event_id),
        "created_by": user_id
    })

    return result.deleted_count  # 1 if deleted, 0 if not