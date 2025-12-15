import { Component, Inject, OnInit, PLATFORM_ID,ViewChild, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Session } from '../../services/session';
import { Router } from '@angular/router';

import { stringify } from 'querystring';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  UserName: string = '';
  UserRole: string = '';
  UserCompanyName : string ='';
  UserFinYearName : string ='';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sessionservice: Session
  ) {}

  Logout() {
    this.sessionservice.logout();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const sessiondata = sessionStorage.getItem('userobj');
      if (sessiondata) {
        const userobj = JSON.parse(sessiondata);
        this.UserName = userobj.user_name;
        this.UserRole = userobj.user_role;
        this.UserCompanyName = userobj.comp_name;
        this.UserFinYearName = userobj.fin_name;
        console.log(userobj);
      } else {
        console.log('the variable is empty');
      }
    }
  }
}