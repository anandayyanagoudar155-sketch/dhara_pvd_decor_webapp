import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import {LoginServices,SingleCompany} from '../services/login-services';
import { MatIconModule } from '@angular/material/icon';

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

  logoBase64: string = '';
  logoFile?: File;
  logoPreview: string | ArrayBuffer | null = null;

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
      cin_number: ['',Validators.pattern(/^[A-Z0-9]{21}$/)],
      gst_number: ['',Validators.pattern(/^[0-9A-Z]{15}$/)],
      pan_number: ['',Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
      contperson_name: [''],
      contact_email: ['', Validators.email],
      contact_phone: ['',Validators.pattern(/^[0-9]{10}$/)],
      address_line1: [''],
      address_line2: [''],
      pincode: ['', Validators.pattern(/^[1-9][0-9]{5}$/)],
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
          pincode: res.pincode
          // logo_path: res.logo_path
        });

      if (res.logo_path) {
        this.logoPreview = "data:image/jpeg;base64," + res.logo_path;
      }

      this.logoBase64 = res.logo_path;

      this.loadCities(0, res.city_id);
      },
      error: err => console.error('Load company error', err)
    });
  }

 onLogoSelect(event: any) {
  this.logoFile = event.target.files[0];

  if (this.logoFile) {
    const reader = new FileReader();

    reader.onload = () => {
      this.logoPreview = reader.result;

      this.logoBase64 = (reader.result as string).split(',')[1];
    };

    reader.readAsDataURL(this.logoFile);
  }
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
      logo_path : this.logoBase64,
      created_by: user.user_id,
      created_date: new Date(),
      modified_by: user.user_id,
      updated_date: new Date()
    };

      // const payload = new FormData();

      // payload.append("comp_code", this.companyForm.value.comp_code);
      // payload.append("comp_name", this.companyForm.value.comp_name);
      // payload.append("comp_short_name", this.companyForm.value.comp_short_name);
      // payload.append("comp_type", this.companyForm.value.comp_type);
      // payload.append("comp_desc", this.companyForm.value.comp_desc);

      // payload.append("cin_number", this.companyForm.value.cin_number);
      // payload.append("gst_number", this.companyForm.value.gst_number);
      // payload.append("pan_number", this.companyForm.value.pan_number);

      // payload.append("contperson_name", this.companyForm.value.contperson_name);
      // payload.append("contact_email", this.companyForm.value.contact_email);
      // payload.append("contact_phone", this.companyForm.value.contact_phone);

      // payload.append("address_line1", this.companyForm.value.address_line1);
      // payload.append("address_line2", this.companyForm.value.address_line2);
      // payload.append("pincode", this.companyForm.value.pincode);

      // payload.append("city_id", this.cityControl.value.city_id);

      // if (this.logoFile) {
      //   payload.append("Logo_File", this.logoFile);
      // }

      // payload.append("created_by", user.user_id);
      // payload.append("created_date", new Date().toISOString());
      // payload.append("modified_by" ,user.user_id);
      // payload.append("updated_date", new Date().toISOString());

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
      logo_path : this.logoBase64,
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