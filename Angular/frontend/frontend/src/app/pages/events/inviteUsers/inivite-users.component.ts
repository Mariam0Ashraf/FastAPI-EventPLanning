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

  allUsers: User[] = [];
  filteredUsers: User[] = [];

  collaborators: Collaborator[] = [];
  filteredCollabs: Collaborator[] = [];

  constructor(
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
        this.loadUsers();
        this.loadCollaborators();
      } else {
        this.router.navigate(['/events']);
      }
    });
  }

  // Load event name
  loadEventName(id: string): void {
    this.eventsDataService.getEventDetails(id).subscribe({
      next: (event) => this.eventName = event.title,
      error: () => this.eventName = `Event #${id}`
    });
  }

  // Load users from API
  loadUsers() {
    this.eventsDataService.getAllUsers().subscribe({
      next: (usersFromDb) => {
        this.allUsers = usersFromDb.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          invited: false 
        }));
        this.filteredUsers = [...this.allUsers];
      },
      error: (err) => console.error("Failed to load users:", err)
    });
  }

  // Load collaborators from API
  loadCollaborators() {
    this.eventsDataService.getAllUsers().subscribe({
      next: (collabsFromDb) => {
        this.collaborators = collabsFromDb.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          assigned: false
        }));
        this.filteredCollabs = [...this.collaborators];
      },
      error: (err) => console.error("Failed to load collaborators:", err)
    });
  }

  /** USERS TAB */
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

    const usersToInvite = this.allUsers.filter(u => u.invited);
    if (!usersToInvite.length) return;

    usersToInvite.forEach(user => {
      this.eventsDataService.inviteUser(user.email, this.eventId!).subscribe({
        next: () => console.log(`Invited: ${user.email}`),
        error: err => console.error("Invite failed:", err)
      });
    });

    // 
    this.router.navigate(['/events']);
  }

  /** COLLABS TAB */
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
    if (!assigned.length || !this.eventId) return;

    assigned.forEach(col => {
      this.eventsDataService.inviteCollaborator(col.email, this.eventId!).subscribe({
        next: () => console.log(`Collaborator assigned: ${col.email}`),
        error: err => console.error("Assign failed:", err)
      });
    });

    this.router.navigate(['/events']);
  }

  /** Back button */
  goBack() {
    this.router.navigate(['/events']);
  }
}
