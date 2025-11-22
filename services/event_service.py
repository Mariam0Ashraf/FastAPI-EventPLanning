from repositories.event_repository import createEvent, findEventsByUser, deleteEventById


async def createEventService(eventData: dict):
    newEvent = await createEvent(eventData)
    return newEvent

async def getUserEventsService(user_id: str):
    events = await findEventsByUser(user_id)
    return events

async def deleteEventService(event_id: str, user_id: str):
    deleted = await deleteEventById(event_id, user_id)

    if deleted == 0:
        return {"error": "Event not found or you do not have permission", "code": 404}

    return {"message": "Event deleted successfully"}