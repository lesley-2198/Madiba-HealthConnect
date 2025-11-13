import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit, AfterViewInit {
  currentDate: string = '';
  activeTab: string = 'dashboard';

  // Mock data
  mockAppointments = [
    { id: 'APT-1001', student: 'Thabo Mthembu', date: '2025-10-22 09:00', nurse: 'Dr. Sarah Johnson', type: 'Primary Care', status: 'Completed' },
    { id: 'APT-1002', student: 'Lerato Dlamini', date: '2025-10-22 09:30', nurse: 'Dr. Michael Chen', type: 'Mental Health', status: 'Completed' },
    { id: 'APT-1003', student: 'Sipho Khumalo', date: '2025-10-22 10:00', nurse: 'Dr. Amina Patel', type: 'Chronic Disease Management', status: 'Assigned' },
    { id: 'APT-1004', student: 'Nomsa Naidoo', date: '2025-10-22 10:30', nurse: 'Dr. John Ndlovu', type: 'Injury/Emergency Care', status: 'Assigned' },
    { id: 'APT-1005', student: 'Bongani Sithole', date: '2025-10-22 11:00', nurse: 'Pending', type: 'General Nursing', status: 'Pending' }
  ];

  mockNurses = [
    { name: 'Dr. Sarah Johnson', specialization: 'Primary Care', appointments: 42, avgTime: '21 min', satisfaction: '96%', availability: 'Available' },
    { name: 'Dr. Michael Chen', specialization: 'Mental Health', appointments: 38, avgTime: '28 min', satisfaction: '94%', availability: 'Available' },
    { name: 'Dr. Amina Patel', specialization: 'Chronic Disease Management', appointments: 45, avgTime: '19 min', satisfaction: '95%', availability: 'Busy' },
    { name: 'Dr. John Ndlovu', specialization: 'Injury/Emergency Care', appointments: 52, avgTime: '25 min', satisfaction: '93%', availability: 'Available' }
  ];

  mockTimeSlots = [
    { time: '09:00 - 10:00', capacity: 8, bookings: 7, utilization: '88%', noShows: 0, status: 'High' },
    { time: '10:00 - 11:00', capacity: 8, bookings: 6, utilization: '75%', noShows: 1, status: 'Optimal' },
    { time: '11:00 - 12:00', capacity: 8, bookings: 5, utilization: '63%', noShows: 0, status: 'Optimal' },
    { time: '14:00 - 15:00', capacity: 8, bookings: 8, utilization: '100%', noShows: 0, status: 'Full' },
    { time: '15:00 - 16:00', capacity: 8, bookings: 7, utilization: '88%', noShows: 1, status: 'High' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  ngAfterViewInit(): void {
    // Initialize all charts after view is loaded
    setTimeout(() => {
      this.initAllCharts();
    }, 100);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    // Reinitialize charts when switching tabs
    setTimeout(() => {
      this.initAllCharts();
    }, 100);
  }

  backToAdmin(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  private initAllCharts(): void {
    if (this.activeTab === 'dashboard') {
      this.initAppointmentsOverTimeChart();
      this.initConsultationTypesChart();
    } else if (this.activeTab === 'nurse-performance') {
      this.initAppointmentsByNurseChart();
      this.initNurseSpecializationChart();
      this.initPerformanceTrendsChart();
      this.initFeedbackScoresChart();
    } else if (this.activeTab === 'clinic-utilization') {
      this.initHourlyBookingChart();
      this.initWeeklyUtilizationChart();
      this.initCampusDistributionChart();
      this.initStatusBreakdownChart();
    }
  }

  // Dashboard Charts
  private initAppointmentsOverTimeChart(): void {
    const canvas = document.getElementById('appointmentsOverTimeChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Appointments',
          data: [85, 92, 78, 95, 87],
          borderColor: '#3c7ab7',
          backgroundColor: 'rgba(60, 122, 183, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private initConsultationTypesChart(): void {
    const canvas = document.getElementById('consultationTypesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Primary Care', 'Mental Health', 'Chronic Disease', 'Injury/Emergency', 'General Nursing'],
        datasets: [{
          data: [145, 78, 112, 65, 87],
          backgroundColor: ['#3c7ab7', '#5dade2', '#4caf50', '#ff9800', '#e91e63']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Nurse Performance Charts
  private initAppointmentsByNurseChart(): void {
    const canvas = document.getElementById('appointmentsByNurseChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Dr. Johnson', 'Dr. Chen', 'Dr. Patel', 'Dr. Ndlovu'],
        datasets: [{
          label: 'Appointments Handled',
          data: [42, 38, 45, 52],
          backgroundColor: '#3c7ab7'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private initNurseSpecializationChart(): void {
    const canvas = document.getElementById('nurseSpecializationChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Primary Care', 'Mental Health', 'Chronic Disease', 'Injury/Emergency'],
        datasets: [{
          data: [1, 1, 1, 1],
          backgroundColor: ['#3c7ab7', '#5dade2', '#4caf50', '#ff9800']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  private initPerformanceTrendsChart(): void {
    const canvas = document.getElementById('performanceTrendsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Consultations',
          data: [95, 102, 98, 110],
          borderColor: '#3c7ab7',
          tension: 0.4
        }, {
          label: 'Satisfaction Score',
          data: [92, 93, 94, 94],
          borderColor: '#4caf50',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private initFeedbackScoresChart(): void {
    const canvas = document.getElementById('feedbackScoresChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Professionalism', 'Communication', 'Timeliness', 'Care Quality', 'Follow-up'],
        datasets: [{
          label: 'Average Scores',
          data: [95, 92, 88, 96, 90],
          borderColor: '#3c7ab7',
          backgroundColor: 'rgba(60, 122, 183, 0.2)',
          pointBackgroundColor: '#3c7ab7'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  // Clinic Utilization Charts
  private initHourlyBookingChart(): void {
    const canvas = document.getElementById('hourlyBookingChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['9AM', '10AM', '11AM', '12PM', '2PM', '3PM', '4PM'],
        datasets: [{
          label: 'Bookings',
          data: [7, 6, 5, 4, 8, 7, 5],
          backgroundColor: '#3c7ab7'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private initWeeklyUtilizationChart(): void {
    const canvas = document.getElementById('weeklyUtilizationChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [{
          label: 'Utilization %',
          data: [82, 75, 88, 79, 85],
          borderColor: '#3c7ab7',
          backgroundColor: 'rgba(60, 122, 183, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private initCampusDistributionChart(): void {
    const canvas = document.getElementById('campusDistributionChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['South Campus', 'North Campus', 'Missionvale', 'Second Avenue', 'George'],
        datasets: [{
          data: [185, 142, 78, 52, 30],
          backgroundColor: ['#3c7ab7', '#5dade2', '#4caf50', '#ff9800', '#e91e63']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  private initStatusBreakdownChart(): void {
    const canvas = document.getElementById('statusBreakdownChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Assigned', 'Pending', 'Cancelled'],
        datasets: [{
          data: [428, 42, 17, 28],
          backgroundColor: ['#4caf50', '#3c7ab7', '#ff9800', '#e53935']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
