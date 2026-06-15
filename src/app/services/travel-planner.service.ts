import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SKIP_AUTH_REDIRECT } from '../interceptors/error.interceptor';

// A lightweight view of an APPROVED travel request, used to populate the
// travel-request-id dropdowns shown to the TravelDeskExe.
export interface TravelRequestOption {
  requestId: number;
  raisedByEmployeeId: number;
  toBeApprovedByHrId: number;
  fromDate: number;
  toDate: number;
  purposeOfTravel: string;
  locationName: string;
  requestStatus: string;
  priority: string;
}

@Injectable({ providedIn: 'root' })
export class TravelPlannerService {
  private baseUrl = `${environment.travelPlannerUrl}/api/travelrequests`;

  constructor(private http: HttpClient) { }

  // GET /api/travelrequests/approved — all APPROVED travel requests (TravelDeskExe only).
  getApprovedTravelRequests(): Observable<TravelRequestOption[]> {
    // Dropdown data — a permission/availability error here must not log the user out.
    return this.http.get<TravelRequestOption[]>(`${this.baseUrl}/approved`, {
      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true)
    });
  }

  // GET /api/travelrequests/my — the logged-in employee's own travel requests
  // (travel-planner derives the employee from the JWT). Used to populate the
  // Employee "My Reservations" dropdown. Dropdown data — must not force a logout.
  getMyTravelRequests(): Observable<TravelRequestOption[]> {
    return this.http.get<TravelRequestOption[]>(`${this.baseUrl}/my`, {
      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true)
    });
  }
}
