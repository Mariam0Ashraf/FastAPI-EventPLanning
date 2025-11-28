import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardComponent } from '../../../@theme/components/card/card.component';
import { EventsDataService } from '../../../core/services/event-data.service';

@Component({
  selector: 'app-invite-users',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, RouterModule, CardComponent
  ],
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss']
})
export class InviteUsersComponent implements OnInit {

  eventId: string | null = null;
  eventName: string = 'Loading Event...';
  activeTab: 'users' | 'collabs' = 'users';

  userEmail = '';
  collabEmail = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsDataService: EventsDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEventName(id);
      } else {
        this.router.navigate(['/events']);
      }
    });
  }

  loadEventName(id: string): void {
    this.eventsDataService.getEventDetails(id).subscribe({
      next: (event) => this.eventName = event.title,
      error: () => this.eventName = `Event #${id}`
    });
  }

  sendInviteUser() {
    if (!this.eventId || !this.userEmail) return;
    this.eventsDataService.inviteUser(this.eventId, this.userEmail).subscribe({
      next: () => console.log(`User invited: ${this.userEmail}`),
      error: err => console.error("Invite failed:", err)
    });
    this.userEmail = '';
  }

  saveCollaborator() {
    if (!this.eventId || !this.collabEmail) return;
    this.eventsDataService.inviteCollaborator(this.eventId, this.collabEmail).subscribe({
      next: () => console.log(`Collaborator assigned: ${this.collabEmail}`),
      error: err => console.error("Assign failed:", err)
    });
    this.collabEmail = '';
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}
