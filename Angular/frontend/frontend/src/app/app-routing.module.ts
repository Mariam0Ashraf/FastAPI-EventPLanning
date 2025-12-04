import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.default),
  },

  // 
  {
    path: 'events',
    loadComponent: () =>
      import('./pages/events/eventManagement/event-management.component')
        .then(m => m.EventManagementComponent)
  },

  
  {
    path: 'events/create',
    loadComponent: () =>
      import('./pages/events/createEvent/create-event.component')
        .then(m => m.CreateEventComponent)
  },

  // Event details
  /*{
    path: 'events/details/:id',
    loadComponent: () =>
      import('./pages/events/eventDetails/event-details.component')
        .then(m => m.EventDetailsComponent)
  },*/

  // Invite users
  {
    path: 'events/invite/:id',
    loadComponent: () =>
      import('./pages/events/inviteUsers/inivite-users.component')
        .then(m => m.InviteUsersComponent)
  },
  

  //  redirect AFTER routes
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  //  wildcard always LAST
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
