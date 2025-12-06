import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class EventsDataService {
  //private api = environment.apiUrl;
 private api = (window as any).__env.apiUrl;
  constructor(private http: HttpClient) {}

  // CREATE EVENT
  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.api}/events/create`, eventData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
    });
  }

  // GET MY EVENTS
  getMyEvents(): Observable<any[]> {
    return this.http
      .get<{ events: any[] }>(`${this.api}/events/my-events`)
      .pipe(map(res => res.events));
  }

  // GET INVITED EVENTS
  getInvitedEvents(): Observable<any[]> {
    return this.http
      .get<{ invited_events: any[] }>(`${this.api}/events/invited-to`)
      .pipe(map(res => res.invited_events));
  }

  // DELETE EVENT
  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.api}/events/delete/${id}`);
  }

  

  // RSVP
  respondToEvent(eventId: string, status: string): Observable<any> {
    return this.http.post(`${this.api}/events/event-attendance`, { event_id: eventId, status });
  }

  /*// GET EVENT DETAILS
  getEventDetails(eventId: string): Observable<any> {
  return this.http.get(`${this.api}/events/${eventId}`);
}*/
    // INVITE ATTENDEE
  // INVITE ATTENDEE
  inviteUser(eventId: string, email: string): Observable<any> {
    return this.http.post(`${this.api}/events/invite-attendee`, { event_id: eventId, email });
  }

  // INVITE COLLABORATOR
  inviteCollaborator(eventId: string, email: string): Observable<any> {
    return this.http.post(`${this.api}/events/invite-collaborator`, { event_id: eventId, email });
  }

  /*// GET ALL USERS
  getAllUsers(): Observable<{ id: string; name: string; email: string }[]> {
    return this.http.get<{ id: string; name: string; email: string }[]>(`${this.api}/users/all`);
  }*/

  // GET USER RSVP
  getUserRsvp(eventId: string): Observable<any> {
    return this.http.get(`${this.api}/events/rsvp/${eventId}`);
  }

  searchEvents(query: string, startDate?: string, endDate?: string, status?: string) {
  const params: any = { q: query };
  
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  if (status) params.status = status;

  return this.http
    .get<{ events: any[] }>(`${this.api}/events/search`, { params })
    .pipe(
      map(res => res.events) // Assuming backend returns { events: [...] }
    );
}
  
 

}
