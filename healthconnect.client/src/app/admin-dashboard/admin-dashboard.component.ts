import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Admin {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

interface Nurse {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  specialization: string;
  isAvailable: boolean;
  currentAppointments: number;
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
  assignedNurseId?: number;
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
  admin: Admin = {
    id: 1,
    employeeNumber: 'A123456',
    fullName: 'Admin User',
    email: 'admin@mandela.ac.za',
    role: 'Clinic Administrator',
    phoneNumber: '+27 123 456 789'
  };

  // Navigation menu
  menuItems = [
    { id: 'overview', label: 'Dashboard Overview', description: 'System summary and metrics', checked: true },
    { id: 'appointments', label: 'Appointment Management', description: 'Assign and manage appointments', checked: false },
    { id: 'nurses', label: 'Nurse Management', description: 'Manage nursing staff', checked: false },
    { id: 'health-news', label: 'Health News', description: 'Create and manage health news', checked: false },
    { id: 'reports', label: 'Reports & Analytics', description: 'View system reports', checked: false }
  ];

  // Nurses data
  nurses: Nurse[] = [
    {
      id: 1,
      employeeNumber: 'N123456',
      fullName: 'Sindisiwe Dlamini',
      email: 'sindi.dlamini@mandela.ac.za',
      specialization: 'General Nursing',
      isAvailable: true,
      currentAppointments: 3
    },
    {
      id: 2,
      employeeNumber: 'N123457',
      fullName: 'James Khumalo',
      email: 'james.khumalo@mandela.ac.za',
      specialization: 'Emergency Care',
      isAvailable: true,
      currentAppointments: 2
    },
    {
      id: 3,
      employeeNumber: 'N123458',
      fullName: 'Nomvula Botha',
      email: 'nomvula.botha@mandela.ac.za',
      specialization: 'Primary Care',
      isAvailable: false,
      currentAppointments: 0
    }
  ];

  // Appointments data
  pendingAppointments: Appointment[] = [
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
      assignedNurseId: 1,
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
  selectedNurseId: number | null = null;

  // UI state
  today: Date = new Date();
  adminInitials: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.adminInitials = this.getInitials(this.admin.fullName);
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
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
        nurse.currentAppointments++;

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

  // Nurse Management
  toggleNurseAvailability(nurse: Nurse): void {
    nurse.isAvailable = !nurse.isAvailable;
    // Here you would typically call an API to update the nurse's availability
    console.log(`Nurse ${nurse.fullName} availability: ${nurse.isAvailable}`);
  }

  addNurse(): void {
    // Implementation for adding new nurse
    alert('Add nurse functionality to be implemented');
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
    this.router.navigate(['/login']);
  }
}
