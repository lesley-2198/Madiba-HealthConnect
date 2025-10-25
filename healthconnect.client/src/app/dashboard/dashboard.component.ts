import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppointmentService, Appointment, CreateAppointmentRequest } from '../services/appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // User data
  user: any = null;
  userInitials: string = '';
  showSuccessModal = false;
  isAfterHours = false;
  modalTitle = '';
  modalMessage = '';
  bookedAppointment: any = null;

  // Appointments data
  appointments: Appointment[] = [];
  isLoadingAppointments = false;

  // Navigation menu items
  menuItems = [
    { id: 'healthconnect', label: 'HealthConnect', description: 'What we have to Offer', checked: true },
    { id: 'self-care', label: 'Self-Care Tips', description: 'Before Booking', checked: false },
    { id: 'manual-booking', label: 'Book & Manage', description: 'Appointments & Bookings', checked: false },
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
  showMobileMenu = false;

  // Nurse Types
  nurseSpecializations = [
    'General Nursing',
    'Emergency Care',
    'Primary Care',
    'Mental Health',
    'Pediatrics',
    'Geriatrics'
  ];

  // Self-care tips for common ailments
  selfCareTips = [
    {
      title: 'Headaches',
      description: 'Rest in a quiet, dark room. Apply a cold compress to your forehead. Stay hydrated and avoid caffeine.',
      severity: 'minor',
      icon: '🤕'
    },
    {
      title: 'Stomach Aches',
      description: 'Drink clear fluids. Eat bland foods like toast or crackers. Avoid dairy and fatty foods. Rest and monitor symptoms.',
      severity: 'minor',
      icon: '🤢'
    },
    {
      title: 'Allergies',
      description: 'Identify and avoid triggers. Take antihistamines as directed. Keep windows closed during high pollen days.',
      severity: 'minor',
      icon: '🤧'
    },
    {
      title: 'Common Cold',
      description: 'Get plenty of rest. Drink warm fluids. Use throat lozenges. Take over-the-counter pain relievers if needed.',
      severity: 'minor',
      icon: '😷'
    },
    {
      title: 'Minor Cuts & Scrapes',
      description: 'Clean with soap and water. Apply antiseptic. Cover with a bandage. Keep the area clean and dry.',
      severity: 'minor',
      icon: '🩹'
    },
    {
      title: 'Mild Fever',
      description: 'Rest and stay hydrated. Take paracetamol as directed. Use lukewarm compresses. Monitor temperature regularly.',
      severity: 'minor',
      icon: '🌡️'
    },
    {
      title: 'When to Seek Help',
      description: 'Book an appointment if symptoms worsen, persist beyond 3 days, or you experience severe pain, high fever (>38.5°C), or difficulty breathing.',
      severity: 'urgent',
      icon: '⚠️'
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
      const selectedDate = new Date(this.bookingForm.value.appointmentDate);
      const selectedTime = this.bookingForm.value.timeSlot;

      // Check if weekend
      if (this.isWeekend(selectedDate)) {
        alert('Appointments cannot be booked on weekends. Clinic operates Monday-Friday only.');
        return;
      }

      this.isSubmittingBooking = true;

      const appointmentData = {
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedTime,
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

          // Check if booking is within operating hours
          this.isAfterHours = this.isAfterClinicHours();
          this.bookedAppointment = appointment;

          if (this.isAfterHours) {
            this.modalTitle = 'Appointment Received - Outside Operating Hours';
            this.modalMessage = 'Your appointment has been received. Since you booked outside of our operating hours (9:00 AM - 4:00 PM, Monday-Friday), a nurse will review and confirm your appointment when the clinic opens. You will receive a notification once it\'s confirmed.';
          } else {
            this.modalTitle = 'Appointment Booked Successfully!';
            this.modalMessage = 'Your appointment has been booked successfully and is pending approval. You can expect communication from the clinic shortly. You will receive a notification once it\'s confirmed.';
          }

          this.showSuccessModal = true;
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

  isAfterClinicHours(): boolean {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();

    // Check if it's a weekend
    if (currentDay === 0 || currentDay === 6) {
      return true;
    }

    // Check if it's outside operating hours (9 AM - 4 PM)
    if (currentHour < 9 || currentHour >= 16) {
      return true;
    }

    return false;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
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

  closeModal(): void {
    this.showSuccessModal = false;
    this.bookedAppointment = null;
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
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateScrollPosition();
  }

  checkMobileView() {
    this.isMobile = window.innerWidth <= 768;
  }

  isMobileView(): boolean {
    return window.innerWidth <= 768;
  }

  // Fix getTotalPages to calculate actual pages (3 cards per page on desktop)
  getTotalPages(): number {
    const visibleCards = 2;
    const totalCards = this.selfCareTips.length;
    // How many scroll positions do we need to see all cards?
    // With 7 cards showing 3: positions 0,1,2,3,4 = 5 positions
    // Formula: totalCards - visibleCards + 1
    return Math.max(1, totalCards - visibleCards + 1);
  }

  scrollNews(direction: number): void {
    const newIndex = this.currentNewsIndex + direction;
    const totalPages = this.getTotalPages();

    if (newIndex >= 0 && newIndex < totalPages) {
      this.currentNewsIndex = newIndex;
      this.updateScrollPosition();
    }
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    // Only prevent body scroll on mobile when menu is open
    if (window.innerWidth <= 768) {
      if (this.showMobileMenu) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    // Always restore scroll when closing
    document.body.style.overflow = '';
  }

  onMobileMenuItemClick(menuItem: any): void {
    this.onMenuItemClick(menuItem);
    this.closeMobileMenu();
  }

  // ADD THIS: Ensure scroll is restored when component is destroyed
  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private updateScrollPosition(): void {
    const cards = document.querySelectorAll('.news-card');
    if (cards.length > 0) {
      const firstCard = cards[0] as HTMLElement;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // 1.5rem = 24px
      // Scroll one card at a time
      this.translateX = -this.currentNewsIndex * (cardWidth + gap);
    }
  }
}
