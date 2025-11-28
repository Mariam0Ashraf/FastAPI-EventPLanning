import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CardComponent } from '../../../@theme/components/card/card.component';
import { EventsDataService } from '../../../core/services/event-data.service'; 

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CardComponent
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {

  title = '';
  location = '';
  date = '';
  time = '';
  description = '';

  constructor(public router: Router, private eventsDataService: EventsDataService) {}

  createEvent() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create an event');
      return;
    }

    let created_by = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      created_by = payload.sub;
    } catch (err) {
      console.error('Failed to parse token:', err);
      alert('Invalid token');
      return;
    }

    const newEventData = {
      title: this.title,
      location: this.location,
      date: new Date(this.date).toISOString(),
      time: this.time,
      description: this.description,
      created_by: created_by,
      invited_users: [] 
    };

    this.eventsDataService.createEvent(newEventData).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (err) => console.error('Failed to create event:', err)
    });
  }
}
