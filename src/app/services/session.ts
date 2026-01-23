import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServices } from './login-services';

@Injectable({
  providedIn: 'root'
})
export class Session {

   private timeout: any;

  constructor(private router: Router, private loginservice : LoginServices ) {}

  startSessionTimer() {
    // Clear old timer if exists
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Set timeout (30 mins = 1800000 ms)
    this.timeout = setTimeout(() => {
      this.logout();
    }, 10 * 60 * 1000);
  }

  resetSessionTimer() {
    this.startSessionTimer(); // restart on activity
  }

  logout() {
    this.loginservice.logout().subscribe({
      next: () => {
        alert('Session expired. Please login again.');
        this.clearSessionAndRedirect();
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Even if token is invalid/expired, force logout
        this.clearSessionAndRedirect();
      }
    });
  }

  private clearSessionAndRedirect() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
