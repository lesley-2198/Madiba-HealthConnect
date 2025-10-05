import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
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
    { id: 'manual-booking', label: 'Manual Booking', description: 'Make Appointments Manually', checked: false },
    { id: 'health-news', label: 'Health News', description: 'What\'s New', checked: false }
  ];

  constructor(private router: Router) { }

  onMenuItemClick(menuItem: any): void {
    // Remove active class from all menu items
    this.menuItems.forEach(item => item.checked = false);

    // Add active class to clicked item
    menuItem.checked = true;
  }

  isSectionActive(sectionId: string): boolean {
    const activeItem = this.menuItems.find(item => item.checked);
    return activeItem ? activeItem.id === sectionId : sectionId === 'healthconnect';
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
