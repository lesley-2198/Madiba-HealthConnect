import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id: number;
  studentId: string;
  nurseId?: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  consultationMode?: string;
  status: string;
  symptomsDescription: string;
  notes?: string;
  prescription?: string;
  createdAt: string;
  updatedAt: string;
  studentName: string;
  studentEmail: string;
  studentNumber: string;
  studentPhoneNumber: string;
  nurseName?: string;
  nurseSpecialization?: string;
}

export interface CreateAppointmentRequest {
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  symptomsDescription: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  timeSlot?: string;
  nurseId?: string;
  status?: string;
  notes?: string;
  prescription?: string;
  consultationMethod?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.production ? `${environment.apiUrl}/appointments` : 'api/appointments';

  constructor(private http: HttpClient) { }

  // Get all appointments for the current user
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  // Get a specific appointment
  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  // Create a new appointment
  createAppointment(appointment: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  // Update an appointment
  updateAppointment(id: number, updates: UpdateAppointmentRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, updates);
  }

  // Delete an appointment
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Assign appointment to nurse (Admin only)
  assignAppointment(appointmentId: number, nurseId: string): Observable<any> {
    const payload = { NurseId: nurseId };
    console.log('🔵 FRONTEND: Sending assignment request:', {
      appointmentId,
      nurseId,
      payload
    });
    return this.http.post(`${this.apiUrl}/${appointmentId}/assign`, payload).pipe(
      tap((response) => console.log('🟢 FRONTEND: Assignment response:', response)),
      catchError((error) => {
        console.error('🔴 FRONTEND: Assignment error:', error);
        return throwError(() => error);
      })
    );
  }
}
