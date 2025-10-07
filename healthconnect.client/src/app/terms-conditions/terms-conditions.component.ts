import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent {
  // Navigation menu items - similar to dashboard
  menuItems = [
    { id: 'acceptance', label: '1. Acceptance', description: 'Terms Agreement', checked: true },
    { id: 'services', label: '2. Services', description: 'What We Provide', checked: false },
    { id: 'user-responsibilities', label: '3. User Responsibilities', description: 'Your Obligations', checked: false },
    { id: 'privacy', label: '4. Privacy', description: 'Data Protection', checked: false },
    { id: 'limitations', label: '5. Limitations', description: 'Service Boundaries', checked: false }
  ];

  constructor(
    private router: Router,
    private location: Location
  ) { }

  onMenuItemClick(menuItem: any): void {
    // Remove active class from all menu items
    this.menuItems.forEach(item => item.checked = false);

    // Add active class to clicked item
    menuItem.checked = true;
  }

  isSectionActive(sectionId: string): boolean {
    const activeItem = this.menuItems.find(item => item.checked);
    return activeItem ? activeItem.id === sectionId : sectionId === 'acceptance';
  }

  navigateBack(): void {
    this.location.back();
  }

  navigateToPrivacyPolicy(): void {
    this.router.navigate(['/privacy-policy']);
  }
}
