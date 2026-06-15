import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationTypeResponseDTO } from '../models/reservation.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationTypeService {
  private baseUrl = `${environment.reservationManagementUrl}/api/reservations/types`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ReservationTypeResponseDTO[]> {
    return this.http.get<ReservationTypeResponseDTO[]>(this.baseUrl);
  }
}
