import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000/api/v1';

@Injectable({ providedIn: 'root' })
export class EventApiService {
  constructor(private http: HttpClient) {}

  // Create Event
  createEvent(data: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/events/create`, data);
  }

  //  Get events created by the user
  getMyEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/events/my-events`);
  }

  //  Get events where user is invited
  getInvitedEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/events/invited-to`);
  }

  //  Delete Event
  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/events/delete/${eventId}`);
  }

  //  Invite attendee
  inviteAttendee(eventId: string, email: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/events/invite-attendee`, {
      event_id: eventId,
      attendee_email: email
    });
  }

  //  Invite collaborator
  inviteCollaborator(eventId: string, email: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/events/invite-collaborator`, {
      event_id: eventId,
      collaborator_email: email
    });
  }
}
