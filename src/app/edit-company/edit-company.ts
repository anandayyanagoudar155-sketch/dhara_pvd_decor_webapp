import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import {LoginServices,SingleCompany} from '../services/login-services';

@Component({
  selector: 'app-edit-company',
  standalone: false,
  templateUrl: './edit-company.html',
  styleUrl: './edit-company.css',
})
export class EditCompany implements OnInit {

  companyForm!: FormGroup;

  isEditMode: boolean = false;
  companyId: number | null = null;

  createdBy!: any;
  createdDate!: any;

  cityControl = new FormControl<any | null>(null);
  cities: any[] = [];
  filteredCities$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private svc: LoginServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.initializeForm();

    this.loadCities(0);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && id > 0) {
      this.isEditMode = true;
      this.companyId = id;
      this.loadCompanyForEdit(id);
    }

    this.filteredCities$ = this.cityControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCities(value))
    );
  }

  initializeForm() {
    this.companyForm = this.fb.group({
      comp_code: ['', Validators.required],
      comp_name: ['', Validators.required],
      comp_short_name: [''],
      comp_type: [''],
      comp_desc: [''],
      cin_number: [''],
      gst_number: [''],
      pan_number: [''],
      contperson_name: [''],
      contact_email: ['', Validators.email],
      contact_phone: [''],
      address_line1: [''],
      address_line2: [''],
      pincode: [''],
      logo_path: ['']
    });
  }


  loadCities(stateId: number, patchCityId?: number) {
  this.svc.getCitys(stateId).subscribe({
    next: res => {
      this.cities = res || [];


      if (patchCityId) {
        const selectedCity = this.cities.find(
          c => c.city_id === patchCityId
        );
        if (selectedCity) {
          this.cityControl.setValue(selectedCity);
        }
      }
    },
    error: err => console.error('City load error', err)
  });
}

  filterCities(value: any): any[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.city_name?.toLowerCase() || '';

    return this.cities.filter(c =>
      c.city_name.toLowerCase().includes(filterValue)
    );
  }

  displayCity(city: any): string {
    return city ? city.city_name : '';
  }

  selectCity(city: any) {
    this.cityControl.setValue(city);
  }

  loadCompanyForEdit(compId: number) {
    this.svc.getCompanyById(compId).subscribe({
      next: (res: SingleCompany) => {

      this.createdBy = res.created_by;
      this.createdDate = res.created_date;

        this.companyForm.patchValue({
          comp_code: res.comp_code,
          comp_name: res.comp_name,
          comp_short_name: res.comp_short_name,
          comp_type: res.comp_type,
          comp_desc: res.comp_desc,
          cin_number: res.cin_number,
          gst_number: res.gst_number,
          pan_number: res.pan_number,
          contperson_name: res.contperson_name,
          contact_email: res.contact_email,
          contact_phone: res.contact_phone,
          address_line1: res.address_line1,
          address_line2: res.address_line2,
          pincode: res.pincode,
          logo_path: res.logo_path
        });

      this.loadCities(0, res.city_id);
      },
      error: err => console.error('Load company error', err)
    });
  }

  submitCompany() {
    if (this.companyForm.invalid || !this.cityControl.value) {
      alert('Please fill all required fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      ...this.companyForm.value,
      city_id: this.cityControl.value.city_id,
      created_by: user.user_id,
      created_date: new Date(),
      modified_by: user.user_id,
      updated_date: new Date()
    };

    this.svc.insertCompany(payload).subscribe({
      next: () => {
        alert('Company added successfully');
        this.router.navigate(['/company']);
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Insert failed');
      }
    });
  }

  updateCompany() {
    if (
      this.companyForm.invalid ||
      !this.cityControl.value ||
      !this.companyId
    ) {
      alert('Please fill all required fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      comp_id: this.companyId,
      ...this.companyForm.value,
      city_id: this.cityControl.value.city_id,
      created_by: this.createdBy,
      created_date: this.createdDate,
      modified_by: user.user_id,
      updated_date: new Date()
    };

    this.svc.updateCompany(payload).subscribe({
      next: () => {
        alert('Company updated successfully');
        this.router.navigate(['/company']);
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Update failed');
      }
    });
  }

  resetForm() {
    this.companyForm.reset();
    this.cityControl.setValue(null);
    this.isEditMode = false;
    this.companyId = null;
  }
}