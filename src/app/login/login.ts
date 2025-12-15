import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginServices, Company, FinancialYear } from '../services/login-services';
import { Session } from '../services/session';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {

  isLoginMode: boolean = true;

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  companies: Company[] = [];
  finYears: FinancialYear[] = [];

  filteredCompanies!: Observable<string[]>;
  filteredFinYears!: Observable<string[]>;

  tempUserId: number | null = null; // STEP 1 ---- STORE user_id from first login

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginServices,
    private sessionService: Session,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  passwordComplexityValidator(control: any) {
    const value = control.value || "";
    const rules = [
      value.length >= 8,
      /[A-Z]/.test(value),
      /[a-z]/.test(value),
      /[0-9]/.test(value),
      /[!@#$%^&*(),.?":{}|<>]/.test(value)
    ];

    return rules.every(r => r) ? null : { passwordComplexity: true };
  }

  switchMode(mode: string) {
    this.isLoginMode = mode === 'login';
  }

  ngOnInit() {

    // ALREADY LOGGED IN
    if (isPlatformBrowser(this.platformId)) {
      if (sessionStorage.getItem("userobj")) {
        this.router.navigate(['/dashboard']);
        return;
      }
    }

    // ========== LOGIN FORM ==========
    this.loginForm = this.fb.group({
      usernameControl: ['', [Validators.required, Validators.email]],
      passwordControl: ['', [Validators.required, Validators.minLength(6)]],
      companyControl: ['', Validators.required],
      finYearControl: ['', Validators.required]
    });

    // ========== SIGNUP FORM ==========
    this.signupForm = this.fb.group({
      usernameControl: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      passwordControl: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator.bind(this)]],
      roleControl: ['', Validators.required],
      companyControl: ['', Validators.required],
      finYearControl: ['', Validators.required]
    });

    // DISABLE company & finyear until username/password verified
    this.loginForm.get('companyControl')?.disable();
    this.loginForm.get('finYearControl')?.disable();

    this.loadloginCompanies();
    this.loadloginFinYears();

    
    this.filteredCompanies = this.signupForm.get('companyControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._companyFilter(value || ''))
    );

    this.filteredFinYears = this.signupForm.get('finYearControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._finYearFilter(value || ''))
    );

        this.filteredCompanies = this.loginForm.get('companyControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._companyFilter(value || ''))
    );

    this.filteredFinYears = this.loginForm.get('finYearControl')!.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._finYearFilter(value || ''))
    );

  }

  loadloginCompanies() {
    this.loginService.getCompanies(0).subscribe({
      next: companies => {
        this.companies = companies;
      }
    });
  }

  loadloginFinYears() {
    this.loginService.getFinYears(0).subscribe({
      next: finYears => {
        this.finYears = finYears;
      }
    });
  }

  

  displayCompanyName(name: string | null): string {
    return name || '';
  }

  displayFinYearName(name: string | null): string {
    return name || '';
  }

  private _companyFilter(value: string): string[] {
    const filter = value.toLowerCase();
    return this.companies.filter(c => c.comp_name.toLowerCase().includes(filter)).map(c => c.comp_name);
  }

  private _finYearFilter(value: string): string[] {
    const filter = value.toLowerCase();
    return this.finYears.filter(f => f.fin_name.toLowerCase().includes(filter)).map(f => f.fin_name);
  }


  

  // ==========================================
  // STEP 1: Validate username & password only
  // ==========================================
  verifyUser() {
    const payload = {
      Email: this.loginForm.get('usernameControl')?.value,
      Password: this.loginForm.get('passwordControl')?.value
    };

    this.loginService.firstLoginValidate(payload).subscribe({
      next: (res: any) => {

        this.tempUserId = res.user_id;
        console.log("User Validated! UserId ->", this.tempUserId);

        // STEP 2: Now load Companies + Fin Year
        this.loadCompanies(res.user_id);
        this.loadFinYears(res.user_id);

        // Enable dropdowns now
        this.loginForm.get('companyControl')?.enable();
        this.loginForm.get('finYearControl')?.enable();

        alert("Username verified. Now select Company & Financial Year.");
      },
      error: () => alert("Invalid Username or Password!")
    });
  }

  // ===================
  loadCompanies(userId: number) {
    this.loginService.getCompanies(userId).subscribe({
      next: companies => {
        this.companies = companies;

        this.filteredCompanies = this.loginForm.get('companyControl')!.valueChanges.pipe(
          startWith(''),
          map(value => this._companyFilter(value || ''))
        );
      }
    });
  }

  loadFinYears(userId: number) {
    this.loginService.getFinYears(userId).subscribe({
      next: finYears => {
        this.finYears = finYears;

        this.filteredFinYears = this.loginForm.get('finYearControl')!.valueChanges.pipe(
          startWith(''),
          map(value => this._finYearFilter(value || ''))
        );
      }
    });
  }

  // ===============================
  // FINAL LOGIN (after company + year)
  // ===============================
  doLogin() {

    if (!this.tempUserId) {
      return this.verifyUser();
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const company = this.companies.find(c => c.comp_name === this.loginForm.get('companyControl')?.value);
    const finYear = this.finYears.find(y => y.fin_name === this.loginForm.get('finYearControl')?.value);

    const payload = {
      Email: this.loginForm.get('usernameControl')?.value,
      Password: this.loginForm.get('passwordControl')?.value,
      comp_id: company?.comp_id,
      fin_year_id: finYear?.fin_year_id
    };

    this.loginService.saveLogin(payload).subscribe({
      next: res => {

        sessionStorage.setItem("userobj", JSON.stringify(res));
        console.log("Final Login: ", res);

        this.sessionService.startSessionTimer();
        alert("Login Successful!");
        this.router.navigate(['/dashboard']);
      },
      error: () => alert("Login Failed!")
    });
  }

  // ================== SIGNUP ==================
  doRegister() {
    const selectedCompanyIds = this.signupForm.get('companyControl')?.value || [];
    const selectedFinYearIds = this.signupForm.get('finYearControl')?.value || [];

    if (this.signupForm.invalid || selectedCompanyIds.length === 0 || selectedFinYearIds.length === 0) {
      this.signupForm.markAllAsTouched();
      alert("Select at least 1 company & 1 financial year.");
      return;
    }

    const payload = {
      User_name: this.signupForm.get('usernameControl')?.value,
      User_password: this.signupForm.get('passwordControl')?.value,
      User_role: this.signupForm.get('roleControl')?.value,
      Comp_ids: selectedCompanyIds.join(','),
      Finyear_ids: selectedFinYearIds.join(',')
    };

    this.loginService.registerUser(payload).subscribe({
      next: () => {
        alert("Registration Successful!");
        this.switchMode('login');
      },
      error: () => alert("Registration Failed!")
    });
  }
}
