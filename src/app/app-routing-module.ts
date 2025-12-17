import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { UserGrid } from './user-grid/user-grid';
import { EditUser } from './edit-user/edit-user';
import { UserdetailsGrid } from './userdetails-grid/userdetails-grid';
import { EditUserdetails } from './edit-userdetails/edit-userdetails';
import { AddUserdetails } from './add-userdetails/add-userdetails';
import { CountryGrid } from './country-grid/country-grid';
import { StateGrid } from './state-grid/state-grid';
import { CityGrid } from './city-grid/city-grid';
import { CompanyGrid } from './company-grid/company-grid';
import { EditCompany } from './edit-company/edit-company';
import { FinyearGrid } from './finyear-grid/finyear-grid';
import { EditFinyear } from './edit-finyear/edit-finyear';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayout,   // Pages with sidenav
    children: [
      { path: 'dashboard', component: Dashboard },
      {path: 'usergrid',component:UserGrid},
      {path: 'useredit/:id',component:EditUser},
      {path: 'userdetailgrid', component:UserdetailsGrid},
      {path: 'userdetailedit/:id',component:EditUserdetails},
      {path: 'adduserdetail',component:AddUserdetails},
      {path: 'country',component:CountryGrid},
      {path: 'state',component:StateGrid},
      {path: 'city',component:CityGrid},
      {path: 'company',component:CompanyGrid},
      {path: 'company/add', component: EditCompany },
      {path: 'company/edit/:id', component: EditCompany },
      {path: 'finyearlist',component:FinyearGrid},
      {path: 'finyear/add', component: EditFinyear },
      {path: 'finyear/edit/:id', component: EditFinyear }
    ]
  },
  {
    path: '',
    component: AuthLayout,   // Pages without sidenav
    children: [
      { path: 'login', component: Login }
    ]
  },
  { path: '**', redirectTo: 'login' } // fallback goes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
