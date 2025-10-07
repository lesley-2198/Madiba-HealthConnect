import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Mock user data
  user = {
    fullName: 'Liyakhanya Mncube',
    email: 's123456789@mandela.ac.za',
    studentNumber: '123456789',
    campus: 'North Campus',
    course: 'Bachelor of Information Technology'
  };

  // Navigation menu items
  menuItems = [
    { id: 'healthconnect', label: 'HealthConnect', description: 'What we have to Offer', checked: true },
    { id: 'tele-consult', label: 'Tele-Consult', description: 'Talk to a Professional', checked: false },
    { id: 'manual-booking', label: 'Book & Manage', description: 'Appointments & Bookings', checked: false }, // Changed
    { id: 'health-news', label: 'Health News', description: 'What\'s New', checked: false }
  ];

  // Add this method (Option 2)
  hasActiveAppointments(): boolean {
    return this.appointments.length > 0;
  }

  // Add these properties to your dashboard component
  availableTimeSlots: any[] = [];
  lunchStart = '13:00';
  lunchEnd = '14:00';

  generateTimeSlots(): void {
    const slots = [];
    const startHour = 9;
    const endHour = 16;

    // Get currently booked times (you might want to filter by selected date too)
    const bookedTimes = this.appointments.map(appt => appt.time);

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

  // Helper method to check if a time slot overlaps with lunch
  isDuringLunch(startTime: string, endTime: string): boolean {
    const slotStart = this.timeToMinutes(startTime);
    const slotEnd = this.timeToMinutes(endTime);
    const lunchStartMinutes = this.timeToMinutes(this.lunchStart);
    const lunchEndMinutes = this.timeToMinutes(this.lunchEnd);

    // Check if the slot overlaps with lunch time
    return (slotStart < lunchEndMinutes && slotEnd > lunchStartMinutes);
  }

  // Helper method to convert time string to minutes
  timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // --- News Scrolling Functionality ---
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

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkMobileView();
    this.generateTimeSlots();
  }

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
    // Calculate translateX based on current index and card width
    if (!this.isMobile) {
      const scrollContainer = document.querySelector('.news-scroll-container');
      if (scrollContainer) {
        const containerWidth = scrollContainer.clientWidth;
        this.translateX = -this.currentNewsIndex * (containerWidth / 3); // Divide by 3 since we show 3 cards
      }
    }
  }

  // ... rest of your existing methods remain unchanged
  onMenuItemClick(menuItem: any): void {
    this.menuItems.forEach(item => item.checked = false);
    menuItem.checked = true;
  }

  isSectionActive(sectionId: string): boolean {
    const activeItem = this.menuItems.find(item => item.checked);
    return activeItem ? activeItem.id === sectionId : sectionId === 'healthconnect';
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  activeBookingTab: 'book' | 'manage' = 'book';
  bookingForm = {
    date: '',
    time: '',
    campus: '',
    reason: '',
    notifications: true
  };

  appointments = [
    { id: 1, date: '2025-10-15', time: '10:00', campus: 'North Campus', status: 'Confirmed' },
    { id: 2, date: '2025-10-20', time: '14:30', campus: 'South Campus', status: 'Pending' }
  ];

  setBookingTab(tab: 'book' | 'manage'): void {
    this.activeBookingTab = tab;
  }

  submitBooking(): void {
    console.log('Booking submitted:', this.bookingForm);
    alert('Your appointment request has been submitted.');
  }

  cancelAppointment(appointmentId: number): void {
    this.appointments = this.appointments.filter(a => a.id !== appointmentId);
    alert('Appointment cancelled.');
  }

  rescheduleAppointment(appointmentId: number): void {
    alert('Reschedule flow to be implemented.');
  }

  teleSelected: 'chat' | 'call' | null = null;

  setTeleSelected(option: 'chat' | 'call'): void {
    this.teleSelected = option;
  }
}
