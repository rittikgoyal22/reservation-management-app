import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadReservationComponent } from './components/upload-reservation/upload-reservation.component';
import { TrackReservationComponent } from './components/track-reservation/track-reservation.component';
import { ViewReservationsComponent } from './components/view-reservations/view-reservations.component';
import { ReservationDetailsComponent } from './components/reservation-details/reservation-details.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'reservations/add', pathMatch: 'full' },
  {
    path: 'reservations/add',
    component: UploadReservationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TravelDeskExe'] }
  },
  {
    path: 'reservations/track',
    component: TrackReservationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Employee'] }
  },
  {
    path: 'reservations/track/:travelRequestId',
    component: TrackReservationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Employee'] }
  },
  {
    path: 'reservations/view',
    component: ViewReservationsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TravelDeskExe'] }
  },
  {
    path: 'reservations/:reservationId',
    component: ReservationDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Employee'] }
  },
  { path: '**', redirectTo: 'reservations/add' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
