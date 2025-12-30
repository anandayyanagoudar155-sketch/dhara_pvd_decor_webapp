import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { MatSelectModule } from '@angular/material/select';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';  
import { MatNativeDateModule } from '@angular/material/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { BrandGrid } from './brand-grid/brand-grid';
import { ColourGrid } from './colour-grid/colour-grid';
import { HsnGrid } from './hsn-grid/hsn-grid';
import { MonthGrid } from './month-grid/month-grid';
import { UnitGrid } from './unit-grid/unit-grid';
import { PaytypeGrid } from './paytype-grid/paytype-grid';
import { TranstypeGrid } from './transtype-grid/transtype-grid';
import { ProdtypeGrid } from './prodtype-grid/prodtype-grid';
import { ProductGrid } from './product-grid/product-grid';
import { EditProduct } from './edit-product/edit-product';

ModuleRegistry.registerModules([AllCommunityModule]); 

@NgModule({
  declarations: [
    App,
    MainLayout,
    AuthLayout,
    Login,
    Dashboard,
    UserGrid,
    EditUser,
    UserdetailsGrid,
    EditUserdetails,
    AddUserdetails,
    CountryGrid,
    StateGrid,
    CityGrid,
    CompanyGrid,
    EditCompany,
    FinyearGrid,
    EditFinyear,
    BrandGrid,
    ColourGrid,
    HsnGrid,
    MonthGrid,
    UnitGrid,
    PaytypeGrid,
    TranstypeGrid,
    ProdtypeGrid,
    ProductGrid,
    EditProduct
  ],
  imports: [
   BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    BrowserModule,
    BrowserAnimationsModule, 
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatListOption,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule,
    MatTableModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
