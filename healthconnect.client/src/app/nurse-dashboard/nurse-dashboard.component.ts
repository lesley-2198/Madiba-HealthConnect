import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppointmentService, Appointment, UpdateAppointmentRequest } from '../services/appointment.service';

@Component({
  selector: 'app-nurse-dashboard',
  templateUrl: './nurse-dashboard.component.html',
  styleUrls: ['./nurse-dashboard.component.css']
})
export class NurseDashboardComponent implements OnInit {
  // Real nurse data from authentication
  nurse: any = null;
  nurseInitials: string = '';

  // Appointments data
  appointments: Appointment[] = [];
  isLoadingAppointments = false;
  selectedAppointment: Appointment | null = null;
  appointmentNotesForm: FormGroup;
  isUpdatingAppointment = false;

  // Navigation menu
  menuItems = [
    { id: 'overview', label: 'Dashboard Overview', description: 'Your schedule and workload', checked: true },
    { id: 'appointments', label: 'My Appointments', description: 'Manage your assigned appointments', checked: false },
    { id: 'availability', label: 'Availability', description: 'Set your working hours', checked: false },
    { id: 'profile', label: 'Profile', description: 'Update your information', checked: false }
  ];

  // Availability
  availabilityForm: FormGroup;
  isUpdatingAvailability = false;

  // UI state
  today: Date = new Date();
  showUserMenu = false;
  appointmentFilter = 'all';
  activeConsultation: Appointment | null = null;
  consultationNotes = '';
  prescription = '';
  followUpRequired = false;
  followUpDate = '';
  showMobileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.appointmentNotesForm = this.fb.group({
      notes: ['', Validators.required]
    });

    this.availabilityForm = this.fb.group({
      isAvailable: [true]
    });
  }

  ngOnInit(): void {
    this.loadNurseData();
    this.loadAppointments();
  }

  private loadNurseData(): void {
    this.nurse = this.authService.getUser();
    if (this.nurse) {
      this.nurseInitials = this.getInitials(this.nurse.fullName);
      this.availabilityForm.patchValue({
        isAvailable: this.nurse.isAvailable
      });
    }
  }

  private loadAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoadingAppointments = false;
      }
    });
  }

  private getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;

    if (this.showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    document.body.style.overflow = '';
  }

  onMobileMenuItemClick(menuItem: any): void {
    this.onMenuItemClick(menuItem);
    this.closeMobileMenu();
  }

  // Navigation
  onMenuItemClick(menuItem: any): void {
    this.menuItems.forEach(item => item.checked = false);
    menuItem.checked = true;
  }

  isSectionActive(sectionId: string): boolean {
    const activeItem = this.menuItems.find(item => item.checked);
    return activeItem ? activeItem.id === sectionId : sectionId === 'overview';
  }

  // User menu methods
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  // Appointment management
  selectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.appointmentNotesForm.patchValue({
      notes: appointment.notes || ''
    });
  }

  updateAppointmentStatus(appointmentId: number, status: string): void {
    const updateData: UpdateAppointmentRequest = {
      status: status
    };

    this.appointmentService.updateAppointment(appointmentId, updateData).subscribe({
      next: () => {
        // Update local appointment
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (appointment) {
          appointment.status = status;
        }
        alert(`Appointment ${status.toLowerCase()} successfully.`);
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment. Please try again.');
      }
    });
  }

  addNotesToAppointment(): void {
    if (this.appointmentNotesForm.valid && this.selectedAppointment) {
      this.isUpdatingAppointment = true;

      const updateData: UpdateAppointmentRequest = {
        notes: this.appointmentNotesForm.value.notes
      };

      this.appointmentService.updateAppointment(this.selectedAppointment.id, updateData).subscribe({
        next: () => {
          // Update local appointment
          this.selectedAppointment!.notes = this.appointmentNotesForm.value.notes;
          const appointment = this.appointments.find(a => a.id === this.selectedAppointment!.id);
          if (appointment) {
            appointment.notes = this.appointmentNotesForm.value.notes;
          }

          this.isUpdatingAppointment = false;
          alert('Notes added successfully.');
          this.selectedAppointment = null;
        },
        error: (error) => {
          console.error('Error adding notes:', error);
          this.isUpdatingAppointment = false;
          alert('Failed to add notes. Please try again.');
        }
      });
    }
  }

  cancelNotesUpdate(): void {
    this.selectedAppointment = null;
    this.appointmentNotesForm.reset();
  }

  // Availability management
  updateAvailability(): void {
    this.isUpdatingAvailability = true;

    // This would typically call an API to update nurse availability
    // For now, we'll just update the local state
    const isAvailable = this.availabilityForm.value.isAvailable;

    // Simulate API call
    setTimeout(() => {
      this.nurse.isAvailable = isAvailable;
      this.isUpdatingAvailability = false;
      alert(`Availability updated to ${isAvailable ? 'Available' : 'Unavailable'}.`);
    }, 1000);
  }

  // Filter appointments
  getTodaysAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(appt =>
      appt.appointmentDate.split('T')[0] === today
    );
  }

  getUpcomingAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(appt =>
      appt.appointmentDate.split('T')[0] > today
    );
  }

  getPendingAppointments(): Appointment[] {
    return this.appointments.filter(appt => appt.status === 'Pending');
  }

  getAssignedAppointments(): Appointment[] {
    return this.appointments.filter(appt => appt.status === 'Assigned');
  }

  getCompletedAppointments(): Appointment[] {
    return this.appointments.filter(appt => appt.status === 'Completed');
  }

  // Appointment filtering
  filterAppointments(): void {
    // This method can be used to filter appointments based on appointmentFilter
    console.log('Filtering appointments by:', this.appointmentFilter);
  }

  // Consultation methods
  startConsultation(appointment: Appointment): void {
    this.activeConsultation = appointment;
    this.consultationNotes = '';
    this.prescription = '';
    this.followUpRequired = false;
    this.followUpDate = '';
  }

  completeConsultation(appointment: Appointment): void {
    if (this.activeConsultation) {
      this.updateAppointmentStatus(appointment.id, 'Completed');
      this.activeConsultation = null;
      this.consultationNotes = '';
      this.prescription = '';
      this.followUpRequired = false;
      this.followUpDate = '';
    }
  }

  viewAppointmentDetails(appointment: Appointment): void {
    this.selectAppointment(appointment);
    // You can add more detailed view logic here
  }

  rescheduleAppointment(appointment: Appointment): void {
    alert('Reschedule functionality to be implemented');
  }

  // Consultation management
  saveConsultation(): void {
    if (this.activeConsultation && this.consultationNotes) {
      // Save consultation notes
      const updateData: UpdateAppointmentRequest = {
        notes: this.consultationNotes
      };

      this.appointmentService.updateAppointment(this.activeConsultation.id, updateData).subscribe({
        next: () => {
          alert('Consultation notes saved successfully.');
        },
        error: (error) => {
          console.error('Error saving consultation:', error);
          alert('Failed to save consultation notes.');
        }
      });
    } else {
      alert('Please enter consultation notes before saving.');
    }
  }

  cancelConsultation(): void {
    this.activeConsultation = null;
    this.consultationNotes = '';
    this.prescription = '';
    this.followUpRequired = false;
    this.followUpDate = '';
  }

  // Quick stats
  get totalAppointments(): number {
    return this.appointments.length;
  }

  get todaysAppointmentsCount(): number {
    return this.getTodaysAppointments().length;
  }

  get pendingAppointmentsCount(): number {
    return this.getPendingAppointments().length;
  }

  get completedAppointmentsCount(): number {
    return this.getCompletedAppointments().length;
  }

  // Getter for todaysAppointments (used in HTML)
  get todaysAppointments(): Appointment[] {
    return this.getTodaysAppointments();
  }

  logout(): void {
    this.authService.logout();
  }
}
