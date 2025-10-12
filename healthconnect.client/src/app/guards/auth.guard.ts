import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Not logged in - redirect to login
    console.log('AuthGuard: User not logged in, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}
