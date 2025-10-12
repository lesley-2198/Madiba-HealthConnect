import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // First check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.log('RoleGuard: User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      // No roles required - allow access
      return true;
    }

    // Get user's current role
    const userRole = this.authService.getRole();

    // Check if user has required role
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have required role - redirect based on their actual role
    console.log(`RoleGuard: User role '${userRole}' not in required roles:`, requiredRoles);

    // Redirect to appropriate dashboard based on user's role
    switch (userRole) {
      case 'Student':
        this.router.navigate(['/dashboard']);
        break;
      case 'Nurse':
        this.router.navigate(['/nurse-dashboard']);
        break;
      case 'Admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }

    return false;
  }
}
