import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServices,User,Company,FinancialYear  } from '../services/login-services';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Session } from '../services/session';
import { isPlatformBrowser } from '@angular/common';

export interface SingleUserDetails {
  user_details_id: number;
  user_id: number;
  comp_id: number;
  fin_year_id: number;
  is_active: boolean;
  created_date: string;
  updated_date: string | null;
  modified_by: number;
}

@Component({
  selector: 'app-edit-userdetails',
  standalone: false,
  templateUrl: './edit-userdetails.html',
  styleUrl: './edit-userdetails.css',
})

export class EditUserdetails implements OnInit {
  userForm!: FormGroup;

  currentId: number = 0;
  user_details_id!: number;

  companies: Company[] = [];
  finYears: FinancialYear[] = [];
  users: any[] = [];

  filteredCompanies!: Observable<string[]>;
  filteredFinYears!: Observable<string[]>;
  filteredUser!: Observable<string[]>;

  createdDate: any;
  updatedDate: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: LoginServices
  ) {}

  ngOnInit(): void {
    this.user_details_id = Number(this.route.snapshot.paramMap.get('id'));
    this.currentId = this.user_details_id;

    this.userForm = this.fb.group({
      user_details_id: [{ value: '', disabled: true }],
      userIdControl: [{ value: '', disabled: true }],
      compIdControl: ['', Validators.required],
      finYearIdControl: ['', Validators.required],
      isActiveControl: [true],
      modified_by: ['']
    });

    this.loadCompanies();
    this.loadFinYears();
    this.loadUser();

    this.filteredCompanies = this.userForm.get('compIdControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._companyFilter(value || ''))
    );

    this.filteredFinYears = this.userForm.get('finYearIdControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._finYearFilter(value || ''))
    );

    this.filteredUser = this.userForm.get('userIdControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._UserFilter(value || ''))
    );

    // Load user details after data is ready
    setTimeout(() => {
      if (this.currentId) {
        this.loadUserDetails(this.currentId);
      }
    }, 500);
  }

  loadCompanies() {
    this.service.getCompanies(0).subscribe({
      next: companies => this.companies = companies
    });
  }

  loadFinYears() {
    this.service.getFinYears(0).subscribe({
      next: finYears => this.finYears = finYears
    });
  }

  loadUser() {
    this.service.getUsers().subscribe({
      next: users => this.users = users
    });
  }

  displayCompanyName(name: string | null): string {
    return name || '';
  }

  displayFinYearName(name: string | null): string {
    return name || '';
  }

  displayUserName(name: string | null): string {
    return name || '';
  }

  private _companyFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.companies
      .filter(c => c.comp_name.toLowerCase().includes(filterValue))
      .map(c => c.comp_name);
  }

  private _finYearFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.finYears
      .filter(fy => fy.fin_name.toLowerCase().includes(filterValue))
      .map(fy => fy.fin_name);
  }

    private _UserFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users
      .filter(fy => fy.user_name.toLowerCase().includes(filterValue))
      .map(fy => fy.user_name);
  }

  loadUserDetails(id: number) {
    this.service.getUserDetailsById(id).subscribe((ud: SingleUserDetails) => {

    const selectedUser = this.users.find(u => u.user_id === ud.user_id) ?? null;
    const selectedCompany = this.companies.find(c => c.comp_id === ud.comp_id) ?? null;
    const selectedFinyear = this.finYears.find(fy => fy.fin_year_id === ud.fin_year_id) ?? null;

      this.userForm.patchValue({
        user_details_id: ud.user_details_id,
      userIdControl: selectedUser ? selectedUser.user_name : '',
      compIdControl: selectedCompany ? selectedCompany.comp_name : '',
      finYearIdControl: selectedFinyear ? selectedFinyear.fin_name : '',
        isActiveControl: ud.is_active
      });

      this.createdDate = ud.created_date ? new Date(ud.created_date) : null;
      this.updatedDate = ud.updated_date ? new Date(ud.updated_date) : null;

      console.log('Loaded data:', ud);
      console.log('Form:', this.userForm.value);
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const companyName = this.userForm.get('compIdControl')!.value;
    const selectedCompany = this.companies.find(c => c.comp_name === companyName);

    const finYearName = this.userForm.get('finYearIdControl')!.value;
    const selectedFinYear = this.finYears.find(fy => fy.fin_name === finYearName);

    const userName = this.userForm.get('userIdControl')!.value;
    const selecteduser = this.users.find(fy => fy.user_name === userName);
   

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      user_details_id: this.user_details_id,
      user_id: selecteduser?.user_id ?? null,
      comp_id: selectedCompany?.comp_id ?? null,
      fin_year_id: selectedFinYear?.fin_year_id ?? null,
      is_active: this.userForm.get('isActiveControl')!.value,
      created_date: this.createdDate,
      updated_date: new Date(),
      modified_by: userobj.user_id
    };

    console.log('Payload', payload);

    this.service.updateUserDetails(payload).subscribe({
      next: () => {
        alert('User details updated!');
        this.router.navigate(['/userdetailgrid']);
      },
      error: err => {
        console.error(err);
        alert('Failed to update.');
      }
    });
  }
}