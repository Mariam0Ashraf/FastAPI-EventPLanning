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

    return result.deleted_count

async def findEventById(event_id: str):
    event = await eventsCollection.find_one({"_id": ObjectId(event_id)})
    return event

async def addUserToEvent(event_id: str, user_id: str):
    result = await eventsCollection.update_one(
        {"_id": ObjectId(event_id)},
        {"$addToSet": {"invited_users": user_id}}
    )

    return result.modified_count

async def findEventsInvitedTo(user_id: str):
    cursor = eventsCollection.find({"invited_users": user_id})
    events = []
    async for event in cursor:
        events.append(Event(**event))
    return events
