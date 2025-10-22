import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NurseService, CreateNurseRequest, Nurse } from '../services/nurse.service';
import { AppointmentService, Appointment } from '../services/appointment.service';

interface Admin {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Admin data
  admin: any = null;
  adminInitials: string = '';

  // Navigation menu
  menuItems = [
    { id: 'overview', label: 'Dashboard Overview', description: 'System summary and metrics', checked: true },
    { id: 'appointments', label: 'Appointment Management', description: 'Assign and manage appointments', checked: false },
    { id: 'nurses', label: 'Nurse Management', description: 'Manage nursing staff', checked: false },
    { id: 'reports', label: 'Reports & Analytics', description: 'View system reports', checked: false }
  ];

  // Add to your component
  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  // Nurses data
  nurses: Nurse[] = [];
  isCreatingNurse = false;
  nurseForm: FormGroup;
  showNurseForm = false;

  // Appointments data
  pendingAppointments: any[] = [];
  assignedAppointments: Appointment[] = [];

  selectedAppointment: Appointment | null = null;
  selectedNurseId: string | null = null;

  // UI state
  today: Date = new Date();
  showMobileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private nurseService: NurseService,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
  ) {
    // Initialize nurse form
    this.nurseForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      employeeNumber: ['', [Validators.required, Validators.pattern(/^N\d{6}$/)]],
      specialization: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]]
    });
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

  ngOnInit(): void {
    this.loadAdminData();
    this.loadNurses();
    this.loadPendingAppointments();
  }

  // ADD THIS METHOD:
  private loadPendingAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments: Appointment[]) => {  // ADD TYPE
        // Filter pending and assigned appointments
        this.pendingAppointments = appointments.filter((a: Appointment) => a.status === 'Pending');  // ADD TYPE
        this.assignedAppointments = appointments.filter((a: Appointment) => a.status === 'Assigned');  // ADD TYPE
        console.log('Loaded appointments:', appointments);
      },
      error: (error: any) => {  // ADD TYPE
        console.error('Error loading appointments:', error);
      }
    });
  }

  // ADD THIS METHOD
  private loadAdminData(): void {
    this.admin = this.authService.getUser();
    if (this.admin) {
      this.adminInitials = this.getInitials(this.admin.fullName);
    }
  }

  // ADD THIS METHOD
  private getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
  }

  // REPLACE THIS METHOD (around line 180):
  private loadNurses(): void {
    // TODO: Replace with actual API call when endpoint is ready
    this.nurseService.getNurses().subscribe({
      next: (nurses) => {
        this.nurses = nurses;
        console.log('Loaded nurses:', this.nurses);
      },
      error: (error) => {
        console.error('Error loading nurses:', error);
        // Fallback to empty array
        this.nurses = [];
      }
    });
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

  // Appointment Management
  assignAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.selectedNurseId = null;
  }

  confirmAssignment(): void {
    if (this.selectedAppointment && this.selectedNurseId) {
      const nurse = this.nurses.find(n => n.id === this.selectedNurseId);
      if (nurse) {
        // USE the dedicated assignment endpoint
        this.appointmentService.assignAppointment(
          this.selectedAppointment.id,
          this.selectedNurseId
        ).subscribe({
          next: () => {
            // Refresh the appointments list
            this.loadPendingAppointments();
            this.selectedAppointment = null;
            this.selectedNurseId = null;
            alert(`Appointment assigned to ${nurse.fullName}`);
          },
          error: (error: any) => {
            console.error('Error assigning nurse:', error);
            alert('Failed to assign nurse. Please try again.');
          }
        });
      }
    }
  }

  cancelAssignment(): void {
    this.selectedAppointment = null;
    this.selectedNurseId = null;
  }

  getAvailableNurses(): Nurse[] {
    return this.nurses.filter(nurse => nurse.isAvailable);
  }

  // Nurse Management - ADD THESE METHODS
  showCreateNurseForm(): void {
    this.showNurseForm = true;
    this.nurseForm.reset();
  }

  hideCreateNurseForm(): void {
    this.showNurseForm = false;
    this.nurseForm.reset();
  }

  createNurse(): void {
    if (this.nurseForm.valid) {
      this.isCreatingNurse = true;
      const nurseData: CreateNurseRequest = {
        email: this.nurseForm.value.email,
        password: this.nurseForm.value.password,
        fullName: this.nurseForm.value.fullName,
        employeeNumber: this.nurseForm.value.employeeNumber,
        specialization: this.nurseForm.value.specialization,
        phoneNumber: this.nurseForm.value.phoneNumber // ADD THIS
      };

      this.nurseService.createNurse(nurseData).subscribe({
        next: (response) => {
          console.log('Nurse created successfully:', response);
          this.isCreatingNurse = false;
          this.hideCreateNurseForm();
          alert('Nurse created successfully!');
          this.loadNurses();
        },
        error: (error) => {
          console.error('Error creating nurse:', error);
          this.isCreatingNurse = false;
          let errorMessage = 'Failed to create nurse. Please try again.';
          if (error.error?.errors) {
            const identityErrors = error.error.errors;
            errorMessage = identityErrors.map((err: any) => err.description).join(', ');
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  toggleNurseAvailability(nurse: Nurse): void {
    nurse.isAvailable = !nurse.isAvailable;
    // Here you would typically call an API to update the nurse's availability
    console.log(`Nurse ${nurse.fullName} availability: ${nurse.isAvailable}`);
    alert(`Nurse ${nurse.fullName} availability updated to ${nurse.isAvailable ? 'Available' : 'Unavailable'}`);
  }

  addNurse(): void {
    // Implementation for adding new nurse
    this.showCreateNurseForm();
  }

  // ADD THIS METHOD
  private markFormGroupTouched(): void {
    Object.keys(this.nurseForm.controls).forEach(key => {
      const control = this.nurseForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // ADD THIS METHOD
  private mandelaEmailValidator(): any {
    return (control: any): any => {
      if (!control.value) {
        return null;
      }
      const email = control.value as string;
      const isValid = email.toLowerCase().endsWith('@mandela.ac.za');
      return isValid ? null : { invalidAcademicEmail: true };
    };
  }

  // Quick Stats
  get pendingAppointmentsCount(): number {
    return this.pendingAppointments.length;
  }

  get totalNursesCount(): number {
    return this.nurses.length;
  }

  get availableNursesCount(): number {
    return this.nurses.filter(nurse => nurse.isAvailable).length;
  }

  logout(): void {
    this.authService.logout();
  }
}
