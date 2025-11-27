from typing import List

from bson import ObjectId

from core.config import db
from models.event import Event
from requests.event_requests import InvitationStatus

eventsCollection = db["events"]


async def createEvent(eventData: dict):
    result = await eventsCollection.insert_one(eventData)
    newEvent = await eventsCollection.find_one({"_id": result.inserted_id})
    return Event(**newEvent)


async def findEventsByUser(user_id: str):
    cursor = eventsCollection.find({
        "$or": [
            {"created_by": user_id},
            {"collaborators": user_id}
        ]
    })

    events = []
    async for event in cursor:
        events.append(Event(**event))

    return events


async def deleteEventById(event_id: str, user_id: str):
    result = await eventsCollection.delete_one({
        "_id": ObjectId(event_id),
        "$or": [
            {"created_by": user_id},
            {"collaborators": user_id}
        ]
    })
    return result.deleted_count


async def findEventById(event_id: str):
    event = await eventsCollection.find_one({"_id": ObjectId(event_id)})
    if event:
        return Event(**event)
    return None


async def addUserToEvent(event_id: str, user_id: str):
    result = await eventsCollection.update_one(
        {"_id": ObjectId(event_id)},
        {"$addToSet": {"invited_users": {"user_id": user_id, "status": InvitationStatus.PENDING}}}
    )

    return result.modified_count


async def findEventsInvitedTo(user_id: str):
    cursor = eventsCollection.find({"invited_users.user_id": user_id})
    events = []
    async for event in cursor:
        events.append(Event(**event))
    return events


async def updateEvent(event_id: str, update_data: dict):
    await eventsCollection.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": update_data}
    )
    updated = await eventsCollection.find_one({"_id": ObjectId(event_id)})
    return Event(**updated)


async def search_events(
        user_id: str,
        query: str | None = None,
        start_date: str | None = None,
        end_date: str | None = None,
        status: InvitationStatus | None = None
) -> List[Event]:
    # 1. Base Filter: Start with an empty filter
    # We will build this up dynamically.
    mongo_filter = {}

    # 2. Text Search (Title OR Description)
    if query:
        # 'i' option makes it case-insensitive
        mongo_filter["$or"] = [
            {"title": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}}
        ]

    # 3. Date Range Filter
    # Assumes 'date' is stored in a comparable format (ISO string or Date object)
    if start_date or end_date:
        date_filter = {}
        if start_date:
            date_filter["$gte"] = start_date
        if end_date:
            date_filter["$lte"] = end_date
        mongo_filter["date"] = date_filter

    # 4. User Role/Status Filter
    # This is tricky: "Find events where THIS user has THIS status"
    if status:
        # Match events where the 'invited_users' array contains an element
        # that has BOTH the user_id AND the specific status
        mongo_filter["invited_users"] = {
            "$elemMatch": {
                "user_id": user_id,
                "status": status
            }
        }
    else:
        # Default: If no status provided, just ensure the user is invited
        # (or is the creator, depending on your logic)
        mongo_filter["$or"] = [
            {"invited_users.user_id": user_id},
            {"created_by": user_id}
        ]

    # 5. Execute Query
    cursor = eventsCollection.find(mongo_filter)
    events = await cursor.to_list(length=100)  # Limit to 100 for safety

    # 6. Map to Pydantic Models
    return [Event(**event) for event in events]