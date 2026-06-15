import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationResponseDTO, ReservationTypeResponseDTO } from '../models/reservation.model';
import { environment } from '../../environments/environment';
import { SKIP_AUTH_REDIRECT } from '../interceptors/error.interceptor';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private baseUrl = `${environment.reservationManagementUrl}/api/reservations`;

  constructor(private http: HttpClient) { }

  getTypes(): Observable<ReservationTypeResponseDTO[]> {
    return this.http.get<ReservationTypeResponseDTO[]>(`${this.baseUrl}/types`);
  }

  addReservation(formData: FormData): Observable<ReservationResponseDTO> {
    return this.http.post<ReservationResponseDTO>(`${this.baseUrl}/add`, formData);
  }

  trackByTravelRequest(travelRequestId: number, skipAuthRedirect = false): Observable<ReservationResponseDTO[]> {
    // The View Reservations page (TravelDeskExe) passes skipAuthRedirect so that a
    // 403/404 shows "No reservation found" instead of forcing a logout. The Employee
    // track page keeps the default (false) so an expired session still redirects.
    const options = skipAuthRedirect
      ? { context: new HttpContext().set(SKIP_AUTH_REDIRECT, true) }
      : {};
    return this.http.get<ReservationResponseDTO[]>(`${this.baseUrl}/track/${travelRequestId}`, options);
  }

  getById(reservationId: number): Observable<ReservationResponseDTO> {
    return this.http.get<ReservationResponseDTO>(`${this.baseUrl}/${reservationId}`);
  }

  downloadDocument(reservationId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${reservationId}/download`, { responseType: 'blob' });
  }
}
