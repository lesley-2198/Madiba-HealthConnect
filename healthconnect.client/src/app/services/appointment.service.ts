import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  createdAt: string;
  updatedAt: string;
  studentName: string;
  studentEmail: string;
  studentNumber: string;
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
  id: number;
  appointmentDate?: string;
  timeSlot?: string;
  consultationType?: string;
  symptomsDescription?: string;
  notes?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'api/appointments';

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
  updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, appointment);
  }

  // Delete an appointment
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Assign appointment to nurse (Admin only)
  assignAppointment(id: number, nurseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/assign`, { nurseId });
  }
}
