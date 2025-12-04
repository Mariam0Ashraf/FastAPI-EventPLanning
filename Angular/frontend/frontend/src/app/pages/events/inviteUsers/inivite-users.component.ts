/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardComponent } from '../../../@theme/components/card/card.component';

import { EventsDataService } from '../../../core/services/event-data.service';

interface User {
  id: string;
  name: string;
  email: string;
  invited: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  assigned: boolean;
}

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

  searchTerm = '';
  collabSearch = '';

  allUsers: User[] = [
    { id: '101', name: 'Adam Smith', email: 'adam@example.com', invited: false },
    { id: '102', name: 'Jane Doe', email: 'jane@example.com', invited: false },
    { id: '103', name: 'Chris Evans', email: 'chris@example.com', invited: false },
    { id: '104', name: 'Olivia White', email: 'olivia@example.com', invited: false },
  ];

  filteredUsers: User[] = [];

  collaborators: Collaborator[] = [
    { id: '201', name: 'Project Manager', email: 'pm@example.com', assigned: false },
    { id: '202', name: 'Marketing Lead', email: 'marketing@example.com', assigned: false },
    { id: '203', name: 'Co-Host John', email: 'john@example.com', assigned: false },
  ];

  filteredCollabs: Collaborator[] = [];


  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router,
    private route: ActivatedRoute,
    private eventsDataService: EventsDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        this.eventId = idString;
        this.loadEventName(this.eventId);
        this.filteredUsers = [...this.allUsers];
        this.filteredCollabs = [...this.collaborators];
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

  searchUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.allUsers.filter(
      u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }

  toggleInvite(user: User) {
    user.invited = !user.invited;
    this.searchUsers();
  }

  sendInvites() {
    if (!this.eventId) return;

    const users = this.allUsers.filter(u => u.invited);
    console.log("Inviting:", users);
    this.router.navigate(['/events']);

  }

  /** COLLABS */
  searchCollabs() {
    const term = this.collabSearch.toLowerCase();
    this.filteredCollabs = this.collaborators.filter(
      c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
    );
  }

  toggleCollaborator(col: Collaborator) {
    col.assigned = !col.assigned;
    this.searchCollabs();
  }

  saveCollaborators() {
    const assigned = this.collaborators.filter(c => c.assigned);
    console.log("Assigned collaborators:", assigned);
    this.router.navigate(['/events']);
  }

  goBack() {
   this.router.navigate(['/events']);
  }
}
