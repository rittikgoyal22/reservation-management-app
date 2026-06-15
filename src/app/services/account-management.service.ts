import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmployeeDTO {
  employeeId: number;
  firstName: string;
  emailAddress: string;
  role: string;
  gradeName: string;
  accessGranted: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountManagementService {
  private baseUrl = `${environment.accountManagementUrl}/api/employees`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(this.baseUrl);
  }

  getCurrentEmployee(): Observable<EmployeeDTO> {
    const email = localStorage.getItem('etd_email') ?? '';
    return this.getAll().pipe(
      map(list => {
        const emp = list.find(e => e.emailAddress === email);
        if (!emp) throw new Error('Current user not found');
        return emp;
      })
    );
  }
}
