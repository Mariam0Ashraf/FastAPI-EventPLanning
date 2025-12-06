import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardComponent } from '../../../@theme/components/card/card.component';
import { EventsDataService } from '../../../core/services/event-data.service';
import { firstValueFrom } from 'rxjs';
import { UsersDataService } from '../../../core/services/user-data.service';

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
  eventName: string = 'Event';
  activeTab: 'users' | 'collabs' = 'users';

  userEmail = '';
  collabEmail = '';
  invitedUsers: { user_email: string; status: string }[] = [];
  collaborators: {user_email: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsDataService: EventsDataService,
    private usersDataService: UsersDataService
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.eventId = id;
      this.loadEventFromMyEvents(id);
    } else {
      this.router.navigate(['/events']);
    }
  });
}


  
  loadEventFromMyEvents(eventId: string) {
  this.eventsDataService.getMyEvents().subscribe({
    next: async (events: any[]) => {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      this.eventName = event.title;

      // invited_users already contain emails
      this.invitedUsers = event.invited_users || [];

      // collaborators contains array of emails
      this.loadCollaborators(event);

      // both functions now simplified because backend sends emails directly
      await this.loadInvitedUsersEmails();
      await this.loadCollaboratorsEmails();
    }
  });
}

loadCollaborators(event: any) {
  // 
  const rawCollabs = event.collaborators || [];
  console.log('Raw collaborators from event:', rawCollabs);

  this.collaborators = rawCollabs.map((email: string) => ({
    user_email: email
  }));
}



async loadInvitedUsersEmails() {
  if (!this.invitedUsers.length) return;

  // invited_users.user_id = email because backend now sends email
  this.invitedUsers = this.invitedUsers.map(u => ({
    ...u,
    email: u.user_email   
  }));
}

async loadCollaboratorsEmails() {
  if (!this.collaborators.length) return;

  // collaborators already contain emails → no need for lookup
  this.collaborators = this.collaborators.map(c => ({
    ...c,
    email: c.user_email  // user_id is email
  }));
}



  sendInviteUser() {
  if (!this.eventId || !this.userEmail) return;
  this.eventsDataService.inviteUser(this.eventId, this.userEmail).subscribe({
    next: () => {
      console.log(`User invited: ${this.userEmail}`);
      this.userEmail = '';
      
      if (this.eventId) this.loadEventFromMyEvents(this.eventId);
    },
    error: err => console.error("Invite failed:", err)
  });
}

  saveCollaborator() {
  if (!this.eventId || !this.collabEmail) return;
  this.eventsDataService.inviteCollaborator(this.eventId, this.collabEmail).subscribe({
    next: () => {
      console.log(`Collaborator assigned: ${this.collabEmail}`);
      this.collabEmail = '';
      if (this.eventId) this.loadEventFromMyEvents(this.eventId);
    },
    error: err => console.error("Assign failed:", err)
  });
}

  goBack() {
    this.router.navigate(['/events']);
  }
}