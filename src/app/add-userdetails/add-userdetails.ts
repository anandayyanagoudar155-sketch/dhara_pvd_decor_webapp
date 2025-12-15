import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServices,User,Company,FinancialYear  } from '../services/login-services';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Session } from '../services/session';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-userdetails',
  standalone: false,
  templateUrl: './add-userdetails.html',
  styleUrl: './add-userdetails.css',
})
export class AddUserdetails implements OnInit {
  userForm!: FormGroup;

  companies: Company[] = [];
  finYears: FinancialYear[] = [];
  users: any[] = [];

  // Company Multi-Select
  companySearch: string = "";
  filteredCompanyList: Company[] = [];
  selectedCompanyIds: number[] = [];

  // FinYear Multi-Select
  finYearSearch: string = "";
  filteredFinYearList: FinancialYear[] = [];
  selectedFinYearIds: number[] = [];

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

    this.userForm = this.fb.group({
      user_details_id: [{ value: '', disabled: true }],
      userIdControl: ['', Validators.required],

      // MULTIPLE COMPANIES & FIN YEARS
      compIdControl: [[], Validators.required],
      finYearIdControl: [[], Validators.required],

      isActiveControl: [true],
      modified_by: ['']
    });

    this.loadCompanies();
    this.loadFinYears();
    this.loadUser();

    this.filteredUser = this.userForm.get('userIdControl')!.valueChanges.pipe(
    startWith(''),
    map((value: string | null) => this._UserFilter(value || ''))
    );
  }

  // -----------------------
  // LOAD DATA
  // -----------------------
  loadCompanies() {
    this.service.getCompanies(0).subscribe({
      next: (companies) => {
        this.companies = companies;
        this.filteredCompanyList = companies;
      }
    });
  }

  loadFinYears() {
    this.service.getFinYears(0).subscribe({
      next: (finYears) => {
        this.finYears = finYears;
        this.filteredFinYearList = finYears;
      }
    });
  }

  loadUser() {
    this.service.getUsers().subscribe({
      next: (users) => (this.users = users)
    });
  }

  // -----------------------
  // FILTER LOGIC (SEARCHING)
  // -----------------------
  filterCompanies() {
    const s = this.companySearch.toLowerCase();
    this.filteredCompanyList = this.companies.filter(c =>
      c.comp_name.toLowerCase().includes(s)
    );
  }

  filterFinYears() {
    const s = this.finYearSearch.toLowerCase();
    this.filteredFinYearList = this.finYears.filter(f =>
      f.fin_name.toLowerCase().includes(s)
    );
  }

  private _UserFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users
      .filter(fy => fy.user_name.toLowerCase().includes(filterValue))
      .map(fy => fy.user_name);
  }

  onCompanySearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.companySearch = value;

    this.filteredCompanyList = this.companies.filter(c =>
      c.comp_name.toLowerCase().includes(value)
    );
  }

  onCompanyOpened() {
    this.companySearch = "";
    this.filteredCompanyList = [...this.companies];
  }

  onFinYearSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.finYearSearch = value;

    this.filteredFinYearList = this.finYears.filter(c =>
      c.fin_name.toLowerCase().includes(value)
    );
  }

  onFinYearOpened() {
    this.finYearSearch = "";
    this.filteredFinYearList = [...this.finYears];
  }

  displayUserName(name: string | null): string {
    return name || '';
  }

  // -----------------------
  // SUBMIT
  // -----------------------
  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

  const selectedCompanies = this.userForm.get('compIdControl')!.value || [];
  const selectedFinYears = this.userForm.get('finYearIdControl')!.value || [];
    
    const userName = this.userForm.get('userIdControl')!.value;
    const selecteduser = this.users.find(fy => fy.user_name === userName);

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      user_details_id: 0,
      user_id: selecteduser?.user_id ?? null,
      comp_id: selectedCompanies.join(','),
      fin_year_id: selectedFinYears.join(','),
      is_active: this.userForm.get('isActiveControl')!.value,
      created_date: new Date(),
      updated_date: null,
      modified_by: userobj.user_id
    };

    console.log("FINAL PAYLOAD:", payload);

    this.service.addUserDetails(payload).subscribe({
      next: () => {
        alert('User details added successfully!');
        this.router.navigate(['/userdetailgrid']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add user details.');
      }
    });
  }
}
