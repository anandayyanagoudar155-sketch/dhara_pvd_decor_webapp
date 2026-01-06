import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import {
  CityDropdown,
  FinancialYear,
  Single_Customer_List,
  SingleCustDetail
} from '../services/login-services';
import { LoginServices } from '../services/login-services';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { TwoDecimalValidator } from '../validators/two-decimal.validator';
import { NoSpecialCharValidator } from '../validators/no-special-char.validator';

@Component({
  selector: 'app-edit-customer',
  standalone: false,
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.css',
})
export class EditCustomer implements OnInit {

  /* ================= CUSTOMER ================= */

  customerForm!: FormGroup;
  isEditMode = false;
  customerId: number | null = null;

  createdBy!: number;
  createdDate!: string | null;

  /* ================= AUTOCOMPLETE ================= */

  cityControl = new FormControl<CityDropdown | null>(null, Validators.required);
  cities: CityDropdown[] = [];
  filteredCities$!: Observable<CityDropdown[]>;

  /* ================= CUSTOMER DETAILS ================= */

  finYearControl = new FormControl<number[]>([],Validators.required);
  finYears: FinancialYear[] = [];

  customerDetailGrid: any[] = [];

  gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { headerName: 'Financial Year', field: 'fin_year_name', flex: 1 },
    {
      headerName: 'Opening Balance',
      field: 'opening_balance',
      editable: true,
      valueParser: p => this.decimalParser(p)
    },
    { headerName: 'Invoice Balance', field: 'invoice_balance' },
    { headerName: 'Outstanding Balance', field: 'outstanding_balance' },
    {
      headerName: 'Action',
      width: 120,
      cellRenderer: () => `<button class="btn btn-delete">Delete</button>`
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };

  constructor(
    private fb: FormBuilder,
    private svc: LoginServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.initForm();
    this.setupAutocomplete();
    this.loadFinYears();
    this.loadCities();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && id > 0) {
      this.isEditMode = true;
      this.customerId = id;
      this.loadCustomerForEdit(id);
      this.loadCustomerDetails(id);
    }
  }

  /* ================= FORM ================= */

  initForm() {
    this.customerForm = this.fb.group({
      Customer_Name: ['', [Validators.required, NoSpecialCharValidator.validate]],
      Prefix: ['',[Validators.required, NoSpecialCharValidator.validate]],
      Gender: ['',Validators.required],
      Phonenumber: ['', Validators.required],
      Cust_Address: ['',Validators.required],
      Email_Id: ['',[Validators.required, Validators.email]],
      Dob: [null, Validators.required],
      Aadhaar_Number: ['',Validators.required],
      License_Number: ['',Validators.required],
      Pan_Number: ['',Validators.required],
      Gst_Number: ['',Validators.required],
      Customer_Notes: ['none']
      
    });
  }

  formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
  }

  /* ================= AUTOCOMPLETE ================= */

  setupAutocomplete() {
    this.filteredCities$ = this.cityControl.valueChanges.pipe(
      startWith(null),
      map(v => this.filterCities(v))
    );
  }

  filterCities(v: any) {
    const val = typeof v === 'string' ? v : v?.city_name;
    return this.cities.filter(c =>
      c.city_name.toLowerCase().includes(val?.toLowerCase() || '')
    );
  }

  displayCity(v: CityDropdown) {
    return v?.city_name || '';
  }

  /* ================= LOAD DROPDOWNS ================= */

  // loadCities() {
  //   this.svc.getCitys(0).subscribe(res => {
  //     this.cities = res || [];
  //   });
  // }

  loadCities(patchId?: number) {
    this.svc.getCitys(0).subscribe(res => {
      this.cities = res || [];

      if (patchId) {
        const city = this.cities.find(c => c.city_id === patchId);
        if (city) {
          this.cityControl.setValue(city);
        }
      }
    });
  }

  loadFinYears() {
    const user = JSON.parse(sessionStorage.getItem('userobj')!);
    this.svc.getFinYears(user.user_id).subscribe(res => {
      this.finYears = res || [];
    });
  }

  /* ================= GRID ================= */

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.gridApi.addEventListener('cellClicked', e => {
      if (e.colDef.headerName === 'Action') {
        this.removeRow(e.data);
      }
    });
  }

  decimalParser(params: any) {
    const val = params.newValue;
    if (!TwoDecimalValidator.isValid(val)) {
      return params.oldValue;
    }
    return Number(val);
  }

  onFinYearChange(ids: number[]) {
    ids.forEach(id => {
      if (!this.customerDetailGrid.some(r => r.fin_year_id === id)) {
        const fy = this.finYears.find(f => f.fin_year_id === id);
        if (fy) {
          this.customerDetailGrid.push({
            cust_detail_id: 0,
            fin_year_id: fy.fin_year_id,
            fin_year_name: fy.fin_name,
            opening_balance: 0,
            invoice_balance: 0,
            outstanding_balance: 0,
            isNew: true
          });
        }
      }
    });

    this.customerDetailGrid = this.customerDetailGrid.filter(r =>
      ids.includes(r.fin_year_id)
    );

    this.customerDetailGrid = [...this.customerDetailGrid];
  }

  removeRow(row: any) {
    if (!confirm('Delete this record?')) return;

    if (this.isEditMode && row.cust_detail_id) {
      this.svc.deleteCustDetail(row.cust_detail_id).subscribe(() => {
        this.customerDetailGrid =
          this.customerDetailGrid.filter(r => r !== row);
        this.finYearControl.setValue(
          this.customerDetailGrid.map(r => r.fin_year_id)
        );
        this.customerDetailGrid = [...this.customerDetailGrid];
      });
    } else {
      this.customerDetailGrid =
        this.customerDetailGrid.filter(r => r !== row);
      this.finYearControl.setValue(
        this.customerDetailGrid.map(r => r.fin_year_id)
      );
      this.customerDetailGrid = [...this.customerDetailGrid];
    }
  }

  /* ================= LOAD CUSTOMER ================= */

loadCustomerForEdit(id: number) {
  this.svc.getCustomerById(id).subscribe(res => {
      this.createdBy = res.created_by;
      this.createdDate = res.created_Date;

    this.customerForm.patchValue({
      Customer_Name: res.customer_Name,
      Prefix: res.prefix,
      Gender: res.gender,
      Phonenumber: res.phonenumber,
      Cust_Address: res.cust_Address,
      Email_Id: res.email_Id,
      Dob: res.dob ? new Date(res.dob) : null,
      Aadhaar_Number: res.aadhaar_Number,
      License_Number: res.license_Number,
      Pan_Number: res.pan_Number,
      Gst_Number: res.gst_Number,
      Customer_Notes: res.customer_Notes
    });

    // // city handled separately
    // const city = this.cities.find(c => c.city_id === res.city_Id);
    // if (city) this.cityControl.setValue(city);

    this.loadCities(res.city_Id);
  });
}

  loadCustomerDetails(id: number) {

    this.svc.getCustDetailById(id).subscribe(res => {
      this.customerDetailGrid = res.map(r => ({
        cust_detail_id: r.cust_detail_id,
        fin_year_id: r.fin_year_id,
        fin_year_name: r.fin_year_name,
        opening_balance: r.opening_balance,
        invoice_balance: r.invoice_balance,
        outstanding_balance: r.outstanding_balance,
        isNew: false
      }));

      this.finYearControl.setValue(
        this.customerDetailGrid.map(r => r.fin_year_id)
      );

      this.customerDetailGrid = [...this.customerDetailGrid];
    });
  }

  /* ================= SAVE ================= */

  submitCustomer() {
   const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
    customer_Name: this.customerForm.value.Customer_Name,
    prefix: this.customerForm.value.Prefix,
    gender: this.customerForm.value.Gender,
    phonenumber: this.customerForm.value.Phonenumber,
    cust_Address: this.customerForm.value.Cust_Address,
    email_Id: this.customerForm.value.Email_Id,
    dob:this.formatYMD(this.customerForm.value.Dob),
    aadhaar_Number: this.customerForm.value.Aadhaar_Number,
    license_Number: this.customerForm.value.License_Number,
    pan_Number: this.customerForm.value.Pan_Number,
    gst_Number: this.customerForm.value.Gst_Number,
    customer_Notes: this.customerForm.value.Customer_Notes,
    city_Id: this.cityControl.value!.city_id,
    created_by: user.user_id,
    created_Date: new Date(),
    modified_by: user.user_id,
    updated_Date: new Date()
    };

    this.svc.insertCustomer(payload).subscribe((res: any) => {
      // const cid = res.customer_Id;

      this.customerDetailGrid.forEach(r => {
        this.svc.insertCustDetail({
          customer_id: 0,
          fin_year_id: r.fin_year_id,
          opening_balance: r.opening_balance,
          Created_date: new Date(),
          Updated_date: new Date(),
          Fin_year_id: r.Fin_year_id,
          Comp_id: user.comp_id,
          Created_by: user.user_id,
          Modified_by: user.user_id
        }).subscribe();
      });

      alert('Customer saved');
      this.router.navigate(['/customerlist']);
    });
  }

  updateCustomer() {
    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      Customer_Id: this.customerId,
      customer_Name: this.customerForm.value.Customer_Name,
      prefix: this.customerForm.value.Prefix,
      gender: this.customerForm.value.Gender,
      phonenumber: this.customerForm.value.Phonenumber,
      cust_Address: this.customerForm.value.Cust_Address,
      email_Id: this.customerForm.value.Email_Id,
      dob:this.formatYMD(this.customerForm.value.Dob),
      aadhaar_Number: this.customerForm.value.Aadhaar_Number,
      license_Number: this.customerForm.value.License_Number,
      pan_Number: this.customerForm.value.Pan_Number,
      gst_Number: this.customerForm.value.Gst_Number,
      customer_Notes: this.customerForm.value.Customer_Notes,
      city_Id: this.cityControl.value!.city_id,
      created_by: this.createdBy,
      created_Date: this.createdDate,
      modified_by: user.user_id,
      updated_Date: new Date()
    };

    this.svc.updateCustomer(payload).subscribe(() => {
      this.customerDetailGrid.forEach(r => {
        if (r.isNew) {
          this.svc.insertCustDetail({
            customer_id: 0,
            fin_year_id: r.fin_year_id,
            opening_balance: r.opening_balance,
            Created_date: new Date(),
            Updated_date: new Date(),
            Fin_year_id: r.Fin_year_id,
            Comp_id: user.comp_id,
            Created_by: user.user_id,
            Modified_by: user.user_id
          }).subscribe();
        } else {
          this.svc.updateCustDetail({
            cust_detail_id: r.cust_detail_id,
            customer_id: this.customerId,
            fin_year_id: r.fin_year_id,
            opening_balance: r.opening_balance,
            Created_date: this.createdDate,
            Updated_date: new Date(),
            Fin_year_id: r.Fin_year_id,
            Comp_id: user.comp_id,
            Created_by: this.createdBy,
            Modified_by: user.user_id
          }).subscribe();
        }
      });

      alert('Customer updated');
      this.router.navigate(['/customerlist']);
    });
  }

  resetForm() {
    this.customerForm.reset();
    this.cityControl.setValue(null);
    this.finYearControl.setValue([]);
    this.customerDetailGrid = [];
    this.isEditMode = false;
    this.customerId = null;
  }
}