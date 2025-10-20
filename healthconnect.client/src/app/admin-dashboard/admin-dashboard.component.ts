import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NurseService, CreateNurseRequest, Nurse } from '../services/nurse.service';

interface Admin {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

interface Appointment {
  id: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: 'InPerson' | 'TeleConsult';
  symptomsDescription: string;
  status: 'Pending' | 'Assigned' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  assignedNurseId?: string;
  assignedNurseName?: string;
  createdAt: string;
}

interface HealthNews {
  id: number;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  publishDate?: string;
  createdBy: string;
  createdAt: string;
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
    { id: 'health-news', label: 'Health News', description: 'Create and manage health news', checked: false },
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
  pendingAppointments: any[] = [
    {
      id: 1,
      studentId: 1,
      studentName: 'Lindokuhle Madwendwe',
      studentNumber: 's123456789',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '10:00',
      consultationType: 'InPerson',
      symptomsDescription: 'Routine checkup',
      status: 'Pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Liyakhanya Mncube',
      studentNumber: 's987654321',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '11:30',
      consultationType: 'TeleConsult',
      symptomsDescription: 'Follow-up consultation',
      status: 'Pending',
      createdAt: new Date().toISOString()
    }
  ];

  assignedAppointments: Appointment[] = [
    {
      id: 3,
      studentId: 3,
      studentName: 'Sarah Johnson',
      studentNumber: 's555666777',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: '09:00',
      consultationType: 'InPerson',
      symptomsDescription: 'Vaccination',
      status: 'Assigned',
      assignedNurseId: '1',
      assignedNurseName: 'Sindisiwe Dlamini',
      createdAt: new Date().toISOString()
    }
  ];

  // Health News data
  healthNews: HealthNews[] = [
    {
      id: 1,
      title: 'Mandela Clinic: Extended Hours',
      content: 'Campus clinic now open until 6 PM on weekdays to better serve students.',
      category: 'Clinic Updates',
      isPublished: true,
      publishDate: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Student Wellness Week',
      content: 'Join workshops on stress management, nutrition, and mental health support.',
      category: 'Events',
      isPublished: false,
      createdBy: 'Admin User',
      createdAt: new Date().toISOString()
    }
  ];

  // Form models
  newNewsItem: HealthNews = {
    id: 0,
    title: '',
    content: '',
    category: 'General',
    isPublished: false,
    createdBy: 'Admin User',
    createdAt: new Date().toISOString()
  };

  selectedAppointment: Appointment | null = null;
  selectedNurseId: string | null = null;

  // UI state
  today: Date = new Date();
  showMobileMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private nurseService: NurseService,
    private fb: FormBuilder
  ) {
    // Initialize nurse form
    this.nurseForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      employeeNumber: ['', [Validators.required, Validators.pattern(/^N\d{6}$/)]],
      specialization: ['', Validators.required]
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

  // ADD THIS METHOD
  private loadNurses(): void {
    // For now, we'll use mock data since we don't have a getNurses endpoint yet
    // This will be replaced when we add the backend endpoint
    this.nurses = [
      {
        id: '1',
        email: 'nurse1@mandela.ac.za',
        fullName: 'Sindisiwe Dlamini',
        employeeNumber: 'N123456',
        specialization: 'General Nursing',
        isAvailable: true,
        role: 'Nurse'
      },
      {
        id: '2',
        email: 'nurse2@mandela.ac.za',
        fullName: 'James Khumalo',
        employeeNumber: 'N123457',
        specialization: 'Emergency Care',
        isAvailable: true,
        role: 'Nurse'
      }
    ];
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
        this.selectedAppointment.status = 'Assigned';
        this.selectedAppointment.assignedNurseId = this.selectedNurseId;
        this.selectedAppointment.assignedNurseName = nurse.fullName;

        // Move from pending to assigned
        this.assignedAppointments.push({ ...this.selectedAppointment });
        this.pendingAppointments = this.pendingAppointments.filter(a => a.id !== this.selectedAppointment!.id);

        // Update nurse appointment count
        // nurse.currentAppointments++; // Commented out since currentAppointments doesn't exist in Nurse interface

        alert(`Appointment assigned to ${nurse.fullName}`);
        this.selectedAppointment = null;
        this.selectedNurseId = null;
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
        specialization: this.nurseForm.value.specialization
      };

      this.nurseService.createNurse(nurseData).subscribe({
        next: (response) => {
          console.log('Nurse created successfully:', response);
          this.isCreatingNurse = false;
          this.hideCreateNurseForm();
          alert('Nurse created successfully!');

          // Add the new nurse to the local array immediately
          const newNurse: Nurse = {
            id: response.id || Date.now().toString(), // Use response ID or generate temporary ID
            email: nurseData.email,
            fullName: nurseData.fullName,
            employeeNumber: nurseData.employeeNumber,
            specialization: nurseData.specialization,
            isAvailable: true,
            role: 'Nurse'
          };

          this.nurses.push(newNurse);

          // Refresh nurses list (when we have the endpoint)
          //this.loadNurses();
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

  // Health News Management
  createNews(): void {
    if (this.newNewsItem.title && this.newNewsItem.content) {
      this.newNewsItem.id = Math.max(...this.healthNews.map(item => item.id)) + 1;
      this.healthNews.push({ ...this.newNewsItem });

      // Reset form
      this.newNewsItem = {
        id: 0,
        title: '',
        content: '',
        category: 'General',
        isPublished: false,
        createdBy: 'Admin User',
        createdAt: new Date().toISOString()
      };

      alert('Health news item created successfully!');
    } else {
      alert('Please fill in both title and content.');
    }
  }

  publishNews(newsItem: HealthNews): void {
    newsItem.isPublished = true;
    newsItem.publishDate = new Date().toISOString().split('T')[0];
    alert('News item published!');
  }

  deleteNews(newsItem: HealthNews): void {
    if (confirm('Are you sure you want to delete this news item?')) {
      this.healthNews = this.healthNews.filter(item => item.id !== newsItem.id);
      alert('News item deleted!');
    }
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

  get publishedNewsCount(): number {
    return this.healthNews.filter(item => item.isPublished).length;
  }

  logout(): void {
    this.authService.logout();
  }
}
