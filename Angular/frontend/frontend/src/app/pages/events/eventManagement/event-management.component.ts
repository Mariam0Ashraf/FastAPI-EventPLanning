import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../../@theme/components/card/card.component';
import { EventsDataService } from '../../../core/services/event-data.service';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  role: 'Organizer' | 'Attendee';
  rsvpStatus?: 'going' | 'not_going' | 'maybe';
  created_by: string;
  collaborators?: string[];
  
}

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule, MatTooltipModule, MatIconModule, CardComponent],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})
export class EventManagementComponent implements OnInit {
  searchTerm: string = '';
  filterDate: string = '';

  allEvents: EventItem[] = [];
  filteredMyEvents: EventItem[] = [];
  filteredInvitedEvents: EventItem[] = [];
  filteredCollaboratorEvents: EventItem[] = [];

  CURRENT_USER_ID: string = '';

  constructor(private router: Router, private eventsDataService: EventsDataService) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.CURRENT_USER_ID = payload.email;
      } catch {}
    }
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
  // 1. Load my created events
  this.eventsDataService.getMyEvents().subscribe({
    next: myEventsResponse => {
      const myEvents = myEventsResponse.map(e => ({
        ...e,
        id: e.id ?? e._id,
        created_by: e.created_by ?? e.organizerId,
      }));

      // 2. Load invited events
      this.eventsDataService.getInvitedEvents().subscribe({
        next: invitedResp => {
          const invitedEvents = invitedResp.map(e => ({
            ...e,
            id: e.id ?? e._id,
            created_by: e.created_by ?? e.organizerId,
            rsvpStatus: e.invited_users?.find((u: { user_email: string; status: string }) => u.user_email === this.CURRENT_USER_ID)?.status
            
          }));

          // 3. Combine
          this.allEvents = [...myEvents, ...invitedEvents];

          this.applyFilters();
        },
        error: err => console.error("Failed to load invited events", err)
      });
    },
    error: err => console.error("Failed to load my events", err)
  });
}



applyFilters() {
  let list = [...this.allEvents];

  if (this.searchTerm) {
    const term = this.searchTerm.toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term));
  }

  if (this.filterDate) {
    list = list.filter(e => e.date === this.filterDate);
  }

  this.filteredMyEvents = list.filter(
  e => e.created_by === this.CURRENT_USER_ID || e.collaborators?.includes(this.CURRENT_USER_ID)
);
this.filteredInvitedEvents = list.filter(
  e => e.created_by !== this.CURRENT_USER_ID && !e.collaborators?.includes(this.CURRENT_USER_ID)
);
}

  /*applyFilters() {
    let list = [...this.allEvents];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term));
    }

    if (this.filterDate) {
      list = list.filter(e => e.date === this.filterDate);
    }

    this.filteredMyEvents = list.filter(e => e.created_by === this.CURRENT_USER_ID);
    this.filteredInvitedEvents = list.filter(e => e.created_by !== this.CURRENT_USER_ID);
  }*/

  deleteEvent(id: string, eventTitle: string) {
    if (!id) return;
    if (!confirm(`Are you sure you want to delete event: ${eventTitle}?`)) return;

    this.eventsDataService.deleteEvent(id).subscribe({
      next: () => this.loadEvents(),
      error: err => console.error(`Failed to delete event ${id}:`, err)
    });
  }

  goToInvite(eventId: string) {
  this.router.navigate(['/events/invite', eventId]);
}

rsvp(ev: EventItem, status: 'going' | 'not_going' | 'maybe') {
  this.eventsDataService.respondToEvent(ev.id, status).subscribe({
    next: () => {
      // Update the local RSVP status
      ev.rsvpStatus = status;
    },
    error: err => console.error("Failed to update RSVP", err)
  });
}


    
  goToCreateEvent() {
    this.router.navigate(['/events/create']);
  }
}
