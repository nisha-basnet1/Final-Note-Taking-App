import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = `${environment.API_URL}/auth`;

  // Observable to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  // Expose authentication state as an observable
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  authenticatedUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private _router: Router) {}

  register(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url, formData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const url = `${this.baseUrl}/login`;

    return this.http.post<any>(url, credentials).pipe(
      tap((response) => {
        // Store the token in localStorage
        localStorage.setItem('token', response.access_token);

        const user = {
          id: response.user._id,
          email: response.user.email,
          name: response.user.firstName + ' ' + response.user.lastName,
          profile: response.user.profile
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.authenticatedUser.next(user);

        // Update the authentication state
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return [];
      })
    );
  }

  logout(): Observable<any> {
    const url = `${this.baseUrl}/logout`;
    return this.http.post(url, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.clear();
        this.isAuthenticatedSubject.next(false);
        this.authenticatedUser.next(null);
      })
    );
  }

  // Check if user has a valid token
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get current user
  getCurrentUser(): any {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }
}
