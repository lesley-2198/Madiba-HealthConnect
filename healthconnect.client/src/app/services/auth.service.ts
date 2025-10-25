import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    studentNumber?: string;
    employeeNumber?: string;
    specialization?: string;
    campus?: string;
    course?: string;
    department?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.production ? `${environment.apiUrl}/auth` : 'api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Store token and user info
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
  }

  register(registerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }
}
