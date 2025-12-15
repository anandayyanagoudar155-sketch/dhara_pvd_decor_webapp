import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Session {

   private timeout: any;

  constructor(private router: Router) {}

  startSessionTimer() {
    // Clear old timer if exists
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Set timeout (30 mins = 1800000 ms)
    this.timeout = setTimeout(() => {
      this.logout();
    }, 30 * 60 * 1000);
  }

  resetSessionTimer() {
    this.startSessionTimer(); // restart on activity
  }

  logout() {
    sessionStorage.clear();
    alert('Session expired. Please login again.');
    this.router.navigate(['/login']);
  }
  
}
