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
  DropProdtype,
  DropBrand,
  DropHsn,
  DropUnit,
  SingleProduct
} from '../services/login-services';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct  implements OnInit {

  productForm!: FormGroup;

  isEditMode: boolean = false;
  productId: number | null = null;

  createdBy!: number;
  createdDate!: string | null;

  /* ================= AUTOCOMPLETE CONTROLS ================= */

  prodtypeControl = new FormControl<DropProdtype | null>(null);
  brandControl = new FormControl<DropBrand | null>(null);
  hsnControl = new FormControl<DropHsn | null>(null);
  unitControl = new FormControl<DropUnit | null>(null);

  prodtypes: DropProdtype[] = [];
  brands: DropBrand[] = [];
  hsns: DropHsn[] = [];
  units: DropUnit[] = [];

  filteredProdtypes$!: Observable<DropProdtype[]>;
  filteredBrands$!: Observable<DropBrand[]>;
  filteredHsns$!: Observable<DropHsn[]>;
  filteredUnits$!: Observable<DropUnit[]>;

  constructor(
    private fb: FormBuilder,
    private svc: LoginServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.initializeForm();

    this.loadProdtypes();
    this.loadBrands();
    this.loadHsns();
    this.loadUnits();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && id > 0) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProductForEdit(id);
    }

    this.setupAutocomplete();
  }

  /* ================= FORM ================= */

  initializeForm() {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_desc: [''],
      rate: [0, Validators.required]
    });
  }

  /* ================= AUTOCOMPLETE SETUP ================= */

  setupAutocomplete() {
    this.filteredProdtypes$ = this.prodtypeControl.valueChanges.pipe(
      startWith(null),
      map(value => this.filterProdtypes(value))
    );

    this.filteredBrands$ = this.brandControl.valueChanges.pipe(
      startWith(null),
      map(value => this.filterBrands(value))
    );

    this.filteredHsns$ = this.hsnControl.valueChanges.pipe(
      startWith(null),
      map(value => this.filterHsns(value))
    );

    this.filteredUnits$ = this.unitControl.valueChanges.pipe(
      startWith(null),
      map(value => this.filterUnits(value))
    );
  }

  /* ================= LOAD DROPDOWNS ================= */

  loadProdtypes(patchId?: number) {
    this.svc.getProdtypeDropdown().subscribe(res => {
      this.prodtypes = res || [];
      if (patchId) {
        const val = this.prodtypes.find(p => p.prodtype_Id === patchId);
        if (val) this.prodtypeControl.setValue(val);
      }
    });
  }

  loadBrands(patchId?: number) {
    this.svc.getBrands().subscribe(res => {
      this.brands = res || [];
      if (patchId) {
        const val = this.brands.find(b => b.brand_id === patchId);
        if (val) this.brandControl.setValue(val);
      }
    });
  }

  loadHsns(patchId?: number) {
    this.svc.getHsnDropdown().subscribe(res => {
      this.hsns = res || [];
      if (patchId) {
        const val = this.hsns.find(h => h.hsnId === patchId);
        if (val) this.hsnControl.setValue(val);
      }
    });
  }

  loadUnits(patchId?: number) {
    this.svc.getUnitDropdown().subscribe(res => {
      this.units = res || [];
      if (patchId) {
        const val = this.units.find(u => u.unitId === patchId);
        if (val) this.unitControl.setValue(val);
      }
    });
  }

  /* ================= FILTER FUNCTIONS ================= */

  filterProdtypes(value: any): DropProdtype[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.prodtype_Name?.toLowerCase() || '';
    return this.prodtypes.filter(p =>
      p.prodtype_Name.toLowerCase().includes(filterValue)
    );
  }

  filterBrands(value: any): DropBrand[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.brand_name?.toLowerCase() || '';
    return this.brands.filter(b =>
      b.brand_name.toLowerCase().includes(filterValue)
    );
  }

  filterHsns(value: any): DropHsn[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.hsnCode?.toLowerCase() || '';
    return this.hsns.filter(h =>
      h.hsnCode.toLowerCase().includes(filterValue)
    );
  }

  filterUnits(value: any): DropUnit[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.unitName?.toLowerCase() || '';
    return this.units.filter(u =>
      u.unitName.toLowerCase().includes(filterValue)
    );
  }

  /* ================= DISPLAY FUNCTIONS ================= */

  displayProdtype(val: DropProdtype): string {
    return val ? val.prodtype_Name : '';
  }

  displayBrand(val: DropBrand): string {
    return val ? val.brand_name : '';
  }

  displayHsn(val: DropHsn): string {
    return val ? val.hsnCode : '';
  }

  displayUnit(val: DropUnit): string {
    return val ? val.unitName : '';
  }

  /* ================= EDIT LOAD ================= */

  loadProductForEdit(id: number) {
    this.svc.getProductById(id).subscribe({
      next: (res: SingleProduct) => {
        this.createdBy = res.created_by;
        this.createdDate = res.created_Date;

        this.productForm.patchValue({
          product_name: res.product_name,
          product_desc: res.product_desc,
          rate: res.rate
        });

        this.loadProdtypes(res.prodtype_id);
        this.loadBrands(res.brand_id);
        this.loadHsns(res.hsn_id);
        this.loadUnits(res.unit_id);
      }
    });
  }

  /* ================= INSERT ================= */

  submitProduct() {
    if (
      this.productForm.invalid ||
      !this.prodtypeControl.value ||
      !this.brandControl.value ||
      !this.hsnControl.value ||
      !this.unitControl.value
    ) {
      alert('Please fill all required fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      ...this.productForm.value,
      prodtype_id: this.prodtypeControl.value.prodtype_Id,
      brand_id: this.brandControl.value.brand_id,
      hsn_id: this.hsnControl.value.hsnId,
      unit_id: this.unitControl.value.unitId,
      created_by: user.user_id,
      created_Date: new Date(),
      modified_by: user.user_id,
      updated_Date: new Date()
    };

    this.svc.insertProduct(payload).subscribe({
      next: () => {
        alert('Product added successfully');
        this.router.navigate(['/productlist']);
      },
      error: err => alert(err?.error?.errorMessage || 'Insert failed')
    });
  }

  /* ================= UPDATE ================= */

  updateProduct() {
    if (
      this.productForm.invalid ||
      !this.prodtypeControl.value ||
      !this.brandControl.value ||
      !this.hsnControl.value ||
      !this.unitControl.value ||
      !this.productId
    ) {
      alert('Please fill all required fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      product_Id: this.productId,
      ...this.productForm.value,
      prodtype_id: this.prodtypeControl.value.prodtype_Id,
      brand_id: this.brandControl.value.brand_id,
      hsn_id: this.hsnControl.value.hsnId,
      unit_id: this.unitControl.value.unitId,
      created_by: this.createdBy,
      created_Date: this.createdDate,
      modified_by: user.user_id,
      updated_Date: new Date()
    };

    this.svc.updateProduct(payload).subscribe({
      next: () => {
        alert('Product updated successfully');
        this.router.navigate(['/productlist']);
      },
      error: err => alert(err?.error?.errorMessage || 'Update failed')
    });
  }

  /* ================= RESET ================= */

  resetForm() {
    this.productForm.reset();
    this.prodtypeControl.setValue(null);
    this.brandControl.setValue(null);
    this.hsnControl.setValue(null);
    this.unitControl.setValue(null);
    this.isEditMode = false;
    this.productId = null;
  }
}
