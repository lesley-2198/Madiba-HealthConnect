import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppointmentService, Appointment, CreateAppointmentRequest } from '../services/appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // User data
  user: any = null;
  userInitials: string = '';

  // Appointments data
  appointments: Appointment[] = [];
  isLoadingAppointments = false;

  // Navigation menu items
  menuItems = [
    { id: 'healthconnect', label: 'HealthConnect', description: 'What we have to Offer', checked: true },
    { id: 'tele-consult', label: 'Tele-Consult', description: 'Talk to a Professional', checked: false },
    { id: 'manual-booking', label: 'Book & Manage', description: 'Appointments & Bookings', checked: false },
    { id: 'health-news', label: 'Health News', description: 'What\'s New', checked: false }
  ];

  // Booking form
  bookingForm: FormGroup;
  isSubmittingBooking = false;

  // Time slots
  availableTimeSlots: any[] = [];
  lunchStart = '13:00';
  lunchEnd = '14:00';

  // UI state
  showUserMenu = false;
  activeBookingTab: 'book' | 'manage' = 'book';
  teleSelected: 'chat' | 'call' | null = null;

  // News items
  newsItems = [
    {
      title: 'Mandela Clinic: Extended Hours',
      description: 'Campus clinic now open until 6 PM on weekdays to better serve students.',
      link: 'https://news.mandela.ac.za'
    },
    {
      title: 'Student Wellness Week',
      description: 'Join workshops on stress management, nutrition, and mental health support.',
      link: 'https://news.mandela.ac.za'
    },
    {
      title: 'Free Flu Vaccinations',
      description: 'Get your free flu shot at the campus clinic throughout October.',
      link: 'https://news.mandela.ac.za'
    },
    {
      title: 'SA Health: Vaccination Drive',
      description: 'National vaccination campaign targeting students and young adults.',
      link: 'https://www.gov.za'
    },
    {
      title: 'Health24: Student Health Tips',
      description: 'Expert advice on maintaining wellness during exam season.',
      link: 'https://www.health24.com'
    },
    {
      title: 'WHO: Global Health Update',
      description: 'Latest guidance on public health priorities and response strategies.',
      link: 'https://www.who.int'
    },
    {
      title: 'CDC: Seasonal Flu Guidance',
      description: 'Recommendations for flu prevention and vaccination timing.',
      link: 'https://www.cdc.gov'
    }
  ];

  currentNewsIndex = 0;
  translateX = 0;
  private isMobile = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.bookingForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
      consultationType: ['', Validators.required],
      symptomsDescription: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadAppointments();
    this.checkMobileView();
    this.generateTimeSlots();
  }

  private loadUserData(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.userInitials = this.getInitials(this.user.fullName);
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

  // Form methods
  submitBooking(): void {
    if (this.bookingForm.valid) {
      this.isSubmittingBooking = true;

      const appointmentData: CreateAppointmentRequest = {
        appointmentDate: this.bookingForm.value.appointmentDate,
        timeSlot: this.bookingForm.value.timeSlot,
        consultationType: this.bookingForm.value.consultationType,
        symptomsDescription: this.bookingForm.value.symptomsDescription,
        notes: this.bookingForm.value.notes
      };

      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: (appointment) => {
          console.log('Appointment created successfully:', appointment);
          this.appointments.unshift(appointment);
          this.bookingForm.reset();
          this.isSubmittingBooking = false;
          alert('Appointment booked successfully!');
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          this.isSubmittingBooking = false;
          alert('Failed to book appointment. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.deleteAppointment(appointmentId).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(a => a.id !== appointmentId);
          alert('Appointment cancelled successfully.');
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          alert('Failed to cancel appointment. Please try again.');
        }
      });
    }
  }

  rescheduleAppointment(appointmentId: number): void {
    alert('Reschedule flow to be implemented.');
  }

  // Time slot methods
  generateTimeSlots(): void {
    const slots = [];
    const startHour = 9;
    const endHour = 16;

    const bookedTimes = this.appointments.map(appt => appt.timeSlot);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const nextMinute = minute + 15;
        const nextHour = nextMinute === 60 ? hour + 1 : hour;
        const nextMinuteFormatted = nextMinute === 60 ? '00' : nextMinute.toString().padStart(2, '0');
        const endTimeString = `${nextHour.toString().padStart(2, '0')}:${nextMinuteFormatted}`;

        const isDuringLunch = this.isDuringLunch(timeString, endTimeString);
        const isBooked = bookedTimes.includes(timeString);

        slots.push({
          value: timeString,
          display: `${timeString} - ${endTimeString}`,
          available: !isDuringLunch && !isBooked
        });
      }
    }

    this.availableTimeSlots = slots;
  }

  isDuringLunch(startTime: string, endTime: string): boolean {
    const slotStart = this.timeToMinutes(startTime);
    const slotEnd = this.timeToMinutes(endTime);
    const lunchStartMinutes = this.timeToMinutes(this.lunchStart);
    const lunchEndMinutes = this.timeToMinutes(this.lunchEnd);

    return (slotStart < lunchEndMinutes && slotEnd > lunchStartMinutes);
  }

  isValidTimeSlot(timeSlot: string): boolean {
    const hour = parseInt(timeSlot.split(':')[0]);
    // Only allow appointments between 9 AM and 4 PM
    return hour >= 9 && hour <= 16;
  }

  timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getMinDate(): string {
    // Minimum date is tomorrow (can't book for today or past)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getMaxDate(): string {
    // Maximum date is 30 days from now
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  }

  // Add this method to validate selected date
  onDateChange(): void {
    const selectedDate = this.bookingForm.get('appointmentDate')?.value;
    if (selectedDate) {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend selected - show error and clear selection
        this.bookingForm.get('appointmentDate')?.setErrors({ weekendNotAllowed: true });
        alert('Appointments are not available on weekends. Please select a weekday.');
      } else {
        // Clear any previous errors
        this.bookingForm.get('appointmentDate')?.setErrors(null);
      }
    }
  }

  // UI methods
  hasActiveAppointments(): boolean {
    return this.appointments.length > 0;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  onMenuItemClick(menuItem: any): void {
    this.menuItems.forEach(item => item.checked = false);
    menuItem.checked = true;
  }

  isSectionActive(sectionId: string): boolean {
    const activeItem = this.menuItems.find(item => item.checked);
    return activeItem ? activeItem.id === sectionId : sectionId === 'healthconnect';
  }

  setBookingTab(tab: 'book' | 'manage'): void {
    this.activeBookingTab = tab;
  }

  setTeleSelected(option: 'chat' | 'call'): void {
    this.teleSelected = option;
  }

  logout(): void {
    this.authService.logout();
  }

  // News scrolling methods
  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
    this.updateScrollPosition();
  }

  checkMobileView() {
    this.isMobile = window.innerWidth <= 768;
  }

  isMobileView(): boolean {
    return this.isMobile;
  }

  getTotalPages(): number {
    return this.newsItems.length;
  }

  scrollNews(direction: number): void {
    if (this.isMobile) return;

    const newIndex = this.currentNewsIndex + direction;
    const maxIndex = this.newsItems.length - 1;

    if (newIndex >= 0 && newIndex <= maxIndex) {
      this.currentNewsIndex = newIndex;
      this.updateScrollPosition();
    }
  }

  private updateScrollPosition(): void {
    if (!this.isMobile) {
      const scrollContainer = document.querySelector('.news-scroll-container');
      if (scrollContainer) {
        const containerWidth = scrollContainer.clientWidth;
        this.translateX = -this.currentNewsIndex * (containerWidth / 3);
      }
    }
  }
}
