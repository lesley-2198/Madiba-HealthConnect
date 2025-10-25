import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Nurse {
  id: string;
  email: string;
  fullName: string;
  employeeNumber: string;
  specialization: string;
  phoneNumber: string;
  isAvailable: boolean;
  role: string;
}

export interface CreateNurseRequest {
  email: string;
  password: string;
  fullName: string;
  employeeNumber: string;
  specialization: string;
  phoneNumber: string;
}

export interface UpdateNurseRequest {
  id: string;
  isAvailable?: boolean;
  specialization?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private apiUrl = environment.production ? `${environment.apiUrl}/auth` : 'api/auth';

  constructor(private http: HttpClient) { }

  // Create a new nurse (Admin only)
  createNurse(nurse: CreateNurseRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-nurse`, nurse);
  }

  // Get all nurses (Admin only) - This would need a new backend endpoint
  getNurses(): Observable<Nurse[]> {
    return this.http.get<Nurse[]>(`${this.apiUrl}/nurses`);
  }

  // Update nurse availability (Admin only)
  updateNurseAvailability(nurseId: string, isAvailable: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/nurses/${nurseId}/availability`, { isAvailable });
  }
}
