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
  SingleProduct,
  FinancialYear,
  Single_ProductDetail
} from '../services/login-services';
import { LoginServices } from '../services/login-services';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { TwoDecimalValidator } from '../validators/two-decimal.validator';
import { NoSpecialCharValidator } from '../validators/no-special-char.validator';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct  implements OnInit {

  /* ================= PRODUCT ================= */

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

  /* ================= PRODUCT DETAILS ================= */

  finYearControl = new FormControl<number[]>([]);
  finYears: FinancialYear[] = [];

  productDetailGrid: any[] = [];
  deletedDetailIds: number[] = [];

  // gridApi!: GridApi;
  gridApi!: GridApi;

    decimalValueParser(params: any) {
    const value = params.newValue;

    if (value === null || value === '') {
      return params.oldValue;
    }

    if (!TwoDecimalValidator.isValid(value)) {
      return params.oldValue;
    }

    return Number(value);
  }

  columnDefs: ColDef[] = [
    { headerName: 'Financial Year', field: 'Fin_year_name', flex: 1 },
    {
      headerName: 'Opening Stock',
      field: 'Opening_stock',
      editable: true,
      width: 150,
      valueParser: params => this.decimalValueParser(params)
    },
    { headerName: 'Purchase', field: 'Purchase', width: 120 },
    { headerName: 'Sales', field: 'Sales', width: 120 },
    { headerName: 'Return', field: 'Return', width: 120 },
    { headerName: 'Current Stock', field: 'Current_stock', width: 150 },
    { 
      headerName: 'Reorder Threshold', 
      field: 'reorder_threshold', 
      editable: true,width: 120,
      valueParser: params => this.decimalValueParser(params)
    },
    { headerName: 'Reorder Description', field: 'reorder_desc', editable: true, width: 150 },
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

  /* ================= INIT ================= */

  constructor(
    private fb: FormBuilder,
    private svc: LoginServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupAutocomplete();

    this.loadProdtypes();
    this.loadBrands();
    this.loadHsns();
    this.loadUnits();
    this.loadFinYears();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && id > 0) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProductForEdit(id);
      this.loadProductDetails(id);
    }
  }

  /* ================= FORM ================= */

  initializeForm() {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_desc: ['',  [Validators.required,NoSpecialCharValidator.validate]],
      rate: [0,[Validators.required,TwoDecimalValidator.nonNegative]]
    });
  }

  /* ================= AUTOCOMPLETE ================= */

  setupAutocomplete() {
    this.filteredProdtypes$ = this.prodtypeControl.valueChanges.pipe(
      startWith(null),
      map(v => this.filterProdtypes(v))
    );
    this.filteredBrands$ = this.brandControl.valueChanges.pipe(
      startWith(null),
      map(v => this.filterBrands(v))
    );
    this.filteredHsns$ = this.hsnControl.valueChanges.pipe(
      startWith(null),
      map(v => this.filterHsns(v))
    );
    this.filteredUnits$ = this.unitControl.valueChanges.pipe(
      startWith(null),
      map(v => this.filterUnits(v))
    );
  }

  /* ================= LOAD DROPDOWNS ================= */

  loadProdtypes(patchId?: number) {
    this.svc.getProdtypeDropdown().subscribe(res => {
      this.prodtypes = res || [];
      if (patchId) {
        const v = this.prodtypes.find(x => x.prodtype_Id === patchId);
        if (v) this.prodtypeControl.setValue(v);
      }
    });
  }

  loadBrands(patchId?: number) {
    this.svc.getBrands().subscribe(res => {
      this.brands = res || [];
      if (patchId) {
        const v = this.brands.find(x => x.brand_id === patchId);
        if (v) this.brandControl.setValue(v);
      }
    });
  }

  loadHsns(patchId?: number) {
    this.svc.getHsnDropdown().subscribe(res => {
      this.hsns = res || [];
      if (patchId) {
        const v = this.hsns.find(x => x.hsnId === patchId);
        if (v) this.hsnControl.setValue(v);
      }
    });
  }

  loadUnits(patchId?: number) {
    this.svc.getUnitDropdown().subscribe(res => {
      this.units = res || [];
      if (patchId) {
        const v = this.units.find(x => x.unitId === patchId);
        if (v) this.unitControl.setValue(v);
      }
    });
  }

  loadFinYears() {
    const user = JSON.parse(sessionStorage.getItem('userobj')!);
    this.svc.getFinYears(user.user_id).subscribe(res => {
      this.finYears = res || [];
    });
  }

  /* ================= FILTERS ================= */

  filterProdtypes(v: any) {
    const val = typeof v === 'string' ? v : v?.prodtype_Name;
    return this.prodtypes.filter(p =>
      p.prodtype_Name.toLowerCase().includes(val?.toLowerCase() || '')
    );
  }

  filterBrands(v: any) {
    const val = typeof v === 'string' ? v : v?.brand_name;
    return this.brands.filter(b =>
      b.brand_name.toLowerCase().includes(val?.toLowerCase() || '')
    );
  }

  filterHsns(v: any) {
    const val = typeof v === 'string' ? v : v?.hsnCode;
    return this.hsns.filter(h =>
      h.hsnCode.toLowerCase().includes(val?.toLowerCase() || '')
    );
  }

  filterUnits(v: any) {
    const val = typeof v === 'string' ? v : v?.unitName;
    return this.units.filter(u =>
      u.unitName.toLowerCase().includes(val?.toLowerCase() || '')
    );
  }

  displayProdtype(v: DropProdtype) { return v?.prodtype_Name || ''; }
  displayBrand(v: DropBrand) { return v?.brand_name || ''; }
  displayHsn(v: DropHsn) { return v?.hsnCode || ''; }
  displayUnit(v: DropUnit) { return v?.unitName || ''; }

  /* ================= PRODUCT DETAILS ================= */

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.gridApi.addEventListener('cellClicked', e => {
      if (e.colDef.headerName === 'Action') {
        this.removeRow(e.data);
      }
    });
  }

  onFinYearChange(ids: number[]) {
    ids.forEach(id => {
      if (!this.productDetailGrid.some(r => r.Fin_year_id === id)) {
        const fy = this.finYears.find(f => f.fin_year_id === id);
        if (fy) {
          this.productDetailGrid.push({
            Product_detail_id: 0,
            Fin_year_id: fy.fin_year_id,
            Fin_year_name: fy.fin_name,
            Opening_stock: 0,
            Purchase: 0,
            Sales: 0,
            Return: 0,
            Current_stock: 0,
            reorder_threshold :0,
            reorder_desc : 'none',
            isNew: true
          });
        }
      }
    });

    this.productDetailGrid = this.productDetailGrid.filter(r =>
      ids.includes(r.Fin_year_id)
    );

    this.productDetailGrid = [...this.productDetailGrid];
  }

 removeRow(row: any) {
  if (!confirm('Are you sure you want to delete this record?')) {
    return;
  }

  if (this.isEditMode && row.Product_detail_id) {

    this.svc.deleteProductDetail(row.Product_detail_id).subscribe({
      next: () => {

        this.productDetailGrid =
          this.productDetailGrid.filter(r => r !== row);

        this.finYearControl.setValue(
          this.productDetailGrid.map(r => r.Fin_year_id)
        );

        this.productDetailGrid = [...this.productDetailGrid];
        alert('Product detail deleted successfully');
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Failed to delete product detail');
      }
    });

  } 
  else {
    this.productDetailGrid =
      this.productDetailGrid.filter(r => r !== row);

    this.finYearControl.setValue(
      this.productDetailGrid.map(r => r.Fin_year_id)
    );

    this.productDetailGrid = [...this.productDetailGrid];
  }
}
  loadProductDetails(productId: number) {
    this.svc.getProductDetailById(productId).subscribe(res => {
      const rows = Array.isArray(res) ? res : [res];

      this.productDetailGrid = rows.map(r => ({
        Product_detail_id: r.product_detail_id,
        Fin_year_id: r.fin_year_id,
        Fin_year_name: r.fin_year_name,
        Opening_stock: r.opening_stock,
        Purchase: r.purchase,
        Sales: r.sales,
        Return: r.return,
        Current_stock: r.current_stock,
        reorder_threshold :r.reorder_threshold,
        reorder_desc : r.reorder_desc,
        isNew: false
      }));

      this.finYearControl.setValue(
        this.productDetailGrid.map(r => r.Fin_year_id)
      );

      this.productDetailGrid = [...this.productDetailGrid];
    });
  }

  /* ================= PRODUCT LOAD ================= */

  loadProductForEdit(id: number) {
    this.svc.getProductById(id).subscribe(res => {
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
    });
  }

  /* ================= SAVE ================= */

  submitProduct() {
    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      ...this.productForm.value,
      prodtype_id: this.prodtypeControl.value!.prodtype_Id,
      brand_id: this.brandControl.value!.brand_id,
      hsn_id: this.hsnControl.value!.hsnId,
      unit_id: this.unitControl.value!.unitId,
      created_by: user.user_id,
      created_Date: new Date(),
      modified_by: user.user_id,
      updated_Date: new Date()
    };

    this.svc.insertProduct(payload).subscribe((res: any) => {
      const pid = res.product_Id;
      this.productDetailGrid.forEach(r => {
        this.svc.insertProductDetail({
          // Product_Id: pid,
          // Fin_year_id: r.Fin_year_id,
          // Opening_stock: r.Opening_stock,
          // Comp_id:user.comp_id,
          // created_by: user.user_id,
          // created_Date: new Date(),
          // modified_by: user.user_id,
          // updated_Date: new Date()
          Product_detail_id: 0,
          Product_Id: 0,
          Opening_stock: r.Opening_stock,
          Purchase: 0,
          Sales: 0,
          Return: 0,
          Current_stock: 0,
          reorder_threshold: r.reorder_threshold,
          reorder_desc: r.reorder_desc,
          Created_date: new Date(),
          Updated_date: new Date(),
          Fin_year_id: r.Fin_year_id,
          Comp_id: user.comp_id,
          Created_by: user.user_id,
          Modified_by: user.user_id
        }).subscribe();
      });
      alert('Product & details saved');
      this.router.navigate(['/productlist']);
    });
  }

  updateProduct() {
    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      product_Id: this.productId,
      ...this.productForm.value,
      prodtype_id: this.prodtypeControl.value!.prodtype_Id,
      brand_id: this.brandControl.value!.brand_id,
      hsn_id: this.hsnControl.value!.hsnId,
      unit_id: this.unitControl.value!.unitId,
      created_by: this.createdBy,
      created_Date: this.createdDate,
      modified_by: user.user_id,
      updated_Date: new Date()
    };

    this.svc.updateProduct(payload).subscribe(() => {

      // this.deletedDetailIds.forEach(id =>
      //   this.svc.deleteProductDetail(id).subscribe()
      // );

      this.productDetailGrid.forEach(r => {
        if (r.isNew) {
          this.svc.insertProductDetail({
            Product_detail_id: 0,
            Product_Id: this.productId,
            Opening_stock: r.Opening_stock,
            Purchase: 0,
            Sales: 0,
            Return: 0,
            Current_stock: 0,
            reorder_threshold: r.reorder_threshold,
            reorder_desc: r.reorder_desc,
            Created_date: new Date(),
            Updated_date: new Date(),
            Fin_year_id: r.Fin_year_id,
            Comp_id: user.comp_id,
            Created_by: user.user_id,
            Modified_by: user.user_id
            
          }).subscribe();
        } else {

          console.log('Updating productId:', this.productId);
          
          this.svc.updateProductDetail({
            Product_detail_id: r.Product_detail_id,
            Product_Id: this.productId,
            Opening_stock: r.Opening_stock,
            Purchase: r.purchase,
            Sales: r.sales,
            Return: r.return,
            Current_stock: r.current_stock,
            reorder_threshold: r.reorder_threshold,
            reorder_desc: r.reorder_desc,
            Created_date: this.createdDate,
            Updated_date: new Date(),
            Fin_year_id: r.Fin_year_id,
            Comp_id: user.comp_id,
            Created_by: this.createdBy,
            Modified_by: user.user_id
          }).subscribe();
        }
      });

      alert('Product & details updated');
      this.router.navigate(['/productlist']);
    });
  }

  resetForm() {
    this.productForm.reset();
    this.prodtypeControl.setValue(null);
    this.brandControl.setValue(null);
    this.hsnControl.setValue(null);
    this.unitControl.setValue(null);
    this.finYearControl.setValue([]);
    this.productDetailGrid = [];
    this.deletedDetailIds = [];
    this.isEditMode = false;
    this.productId = null;
  }
}