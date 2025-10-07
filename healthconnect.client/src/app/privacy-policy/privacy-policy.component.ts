import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
  // Navigation menu items - similar to Terms & Conditions
  menuItems = [
    { id: 'introduction', label: '1. Introduction', description: 'Policy Overview', checked: true },
    { id: 'data-collection', label: '2. Data Collection', description: 'What We Collect', checked: false },
    { id: 'data-usage', label: '3. Data Usage', description: 'How We Use Data', checked: false },
    { id: 'data-sharing', label: '4. Data Sharing', description: 'Third Parties', checked: false },
    { id: 'user-rights', label: '5. Your Rights', description: 'POPI Rights', checked: false },
    { id: 'security', label: '6. Security', description: 'Protection Measures', checked: false }
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
    return activeItem ? activeItem.id === sectionId : sectionId === 'introduction';
  }

  navigateBack(): void {
    this.location.back();
  }

  navigateToTerms(): void {
    this.router.navigate(['/terms-conditions']);
  }
}
