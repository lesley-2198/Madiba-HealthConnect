import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Nurse {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  specialization: string;
  phoneNumber: string;
  isAvailable: boolean;
  workingHours: string;
}

interface Appointment {
  id: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: 'InPerson' | 'TeleConsult';
  consultationMode?: 'VoiceCall' | 'VideoCall' | 'Chat';
  symptomsDescription: string;
  status: 'Pending' | 'Assigned' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  createdAt: string;
}

@Component({
  selector: 'app-nurse-dashboard',
  templateUrl: './nurse-dashboard.component.html',
  styleUrls: ['./nurse-dashboard.component.css']
})
export class NurseDashboardComponent implements OnInit {
  // Nurse data
  nurse: any = null;
  nurseInitials: string = '';

  // Navigation menu
  menuItems = [
    { id: 'schedule', label: "Today's Schedule", description: 'View today\'s appointments', checked: true },
    { id: 'appointments', label: 'All Appointments', description: 'Manage all appointments', checked: false },
    { id: 'consultations', label: 'Consultations', description: 'Conduct patient consultations', checked: false },
    { id: 'availability', label: 'Availability', description: 'Manage your schedule', checked: false }
  ];

  // Add to your component
  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  // Appointments data
  // In your todaysAppointments array, add createdAt:
  todaysAppointments: Appointment[] = [
    {
      id: 1,
      studentId: 1,
      studentName: 'Lindokuhle Madwendwe',
      studentNumber: 's123456789',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '08:45',
      consultationType: 'InPerson',
      symptomsDescription: 'Family planning consultation',
      status: 'Confirmed',
      createdAt: new Date().toISOString() // Add this line
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Liyakhanya Mncube',
      studentNumber: 's987654321',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '09:15',
      consultationType: 'TeleConsult',
      consultationMode: 'VoiceCall',
      symptomsDescription: 'Follow-up on previous treatment',
      status: 'InProgress',
      createdAt: new Date().toISOString() // Add this line
    }
  ];

  // Consultation state
  activeConsultation: Appointment | null = null;
  consultationNotes: string = '';
  prescription: string = '';
  followUpRequired: boolean = false;
  followUpDate: string = '';

  // UI state
  today: Date = new Date();
  appointmentFilter: string = 'all';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.nurseInitials = this.getInitials(this.nurse.fullName);
  }

  // ADD THIS METHOD
  private loadNurseData(): void {
    this.nurse = this.authService.getUser();
    if (this.nurse) {
      this.nurseInitials = this.getInitials(this.nurse.fullName);
    }
  }

  // ADD THIS METHOD
  private getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
  }

  get pendingAppointmentsCount(): number {
    return this.todaysAppointments.filter(apt =>
      apt.status === 'Confirmed' || apt.status === 'Assigned'
    ).length;
  }

  // Navigation
  onMenuItemClick(menuItem: any): void {
    this.menuItems.forEach(item => item.checked = false);
    menuItem.checked = true;
  }

  isSectionActive(sectionId: string): boolean {
    const activeItem = this.menuItems.find(item => item.checked);
    return activeItem ? activeItem.id === sectionId : sectionId === 'schedule';
  }

  // Appointment actions
  startConsultation(appointment: Appointment): void {
    appointment.status = 'InProgress';
    this.activeConsultation = appointment;
    this.onMenuItemClick(this.menuItems.find(item => item.id === 'consultations'));
  }

  completeConsultation(appointment: Appointment): void {
    if (this.consultationNotes.trim()) {
      appointment.status = 'Completed';
      appointment.notes = this.consultationNotes;
      this.activeConsultation = null;
      this.consultationNotes = '';
      this.prescription = '';

      // Show success message
      alert('Consultation completed successfully!');
    } else {
      alert('Please add consultation notes before completing.');
    }
  }

  viewAppointmentDetails(appointment: Appointment): void {
    // Navigate to detailed view or show modal
    console.log('View details for appointment:', appointment);
  }

  rescheduleAppointment(appointment: Appointment): void {
    // Implement reschedule logic
    const newDate = prompt('Enter new date (YYYY-MM-DD):', appointment.appointmentDate);
    const newTime = prompt('Enter new time (HH:MM):', appointment.timeSlot);

    if (newDate && newTime) {
      appointment.appointmentDate = newDate;
      appointment.timeSlot = newTime;
      appointment.status = 'Rescheduled';
      alert('Appointment rescheduled successfully!');
    }
  }

  // Consultation management
  saveConsultation(): void {
    if (this.activeConsultation && this.consultationNotes.trim()) {
      this.activeConsultation.notes = this.consultationNotes;
      alert('Consultation notes saved!');
    } else {
      alert('Please add consultation notes before saving.');
    }
  }

  cancelConsultation(): void {
    if (this.activeConsultation) {
      this.activeConsultation.status = 'Confirmed';
      this.activeConsultation = null;
      this.consultationNotes = '';
      this.prescription = '';
    }
  }

  // Availability management
  updateAvailability(): void {
    // Call API to update nurse availability
    console.log('Availability updated:', this.nurse.isAvailable);
    alert(`You are now ${this.nurse.isAvailable ? 'available' : 'unavailable'} for appointments`);
  }

  filterAppointments(): void {
    // Implement appointment filtering logic
    console.log('Filtering appointments by:', this.appointmentFilter);
  }

  logout(): void {
    this.authService.logout();
  }
}
