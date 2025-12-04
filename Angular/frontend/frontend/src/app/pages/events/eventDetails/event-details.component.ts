import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CardComponent } from '../../../@theme/components/card/card.component';
import { EventsDataService } from '../../../core/services/event-data.service';

type RsvpStatus = 'Going' | 'Maybe' | 'Not Going' | 'Not Responded';

interface EventDetail {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  created_by: string;
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, CardComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: EventDetail | undefined;
  eventId: string | null = null;

  currentUserId: string = '';
  currentUserResponse: RsvpStatus = 'Not Responded';

  attendees = [
    { name: 'Mariam', status: 'Going' },
    { name: 'Sara', status: 'Maybe' },
    { name: 'Omar', status: 'Not Going' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsDataService: EventsDataService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      try { this.currentUserId = JSON.parse(atob(token.split('.')[1])).sub; } catch {}
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEventDetails(id);
      } else this.router.navigate(['/events']);
    });
  }

  loadEventDetails(id: string) {
    this.eventsDataService.getEventDetails(id).subscribe({
      next: data => {
        this.event = { ...data, id: data.id ?? data._id };
        this.loadUserRsvp(id);
      },
      error: err => console.error('Failed to load event details', err)
    });
  }

  loadUserRsvp(id: string) {
    this.eventsDataService.getUserRsvp(id).subscribe({
      next: res => this.currentUserResponse = res.status as RsvpStatus,
      error: () => this.currentUserResponse = 'Not Responded'
    });
  }

  isOrganizer(): boolean { return this.event?.created_by === this.currentUserId; }

  respond(status: 'Going' | 'Maybe' | 'Not Going') {
    if (!this.eventId) return;
    this.currentUserResponse = status;
    this.eventsDataService.respondToEvent(this.eventId, status).subscribe({
      next: () => console.log(`RSVP updated to ${status}`),
      error: () => this.loadUserRsvp(this.eventId!)
    });
  }

  /*deleteEvent() {
    if (!this.eventId || !this.event) return;
    if (confirm(`Are you sure you want to delete event: ${this.event.title}?`)) {
      this.eventsDataService.deleteEvent(this.eventId).subscribe({
        next: () => this.router.navigate(['/events']),
        error: () => alert('Failed to delete event')
      });
    }
  }*/

  inviteUsers() { if (this.eventId) this.router.navigate(['/events/invite', this.eventId]); }
  goBack() { this.router.navigate(['/events']); }
}
