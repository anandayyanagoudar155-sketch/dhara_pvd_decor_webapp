import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-brand-grid',
  standalone: false,
  templateUrl: './brand-grid.html',
  styleUrl: './brand-grid.css',
})
export class BrandGrid implements OnInit {

  gridApi!: GridApi;
  brandList: any[] = [];
  addForm!: FormGroup;

  columnDefs = [
    { headerName: 'Brand ID', field: 'brand_Id', flex: 1, minWidth: 120 },

    { headerName: 'Brand Name', field: 'brand_Name', editable: true, flex: 2, minWidth: 200 },

    { headerName: 'Brand Description', field: 'brand_Desc', editable: true, flex: 2, minWidth: 250 },

    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '6px';

        // UPDATE BUTTON
        const updateButton = document.createElement('button');
        updateButton.classList.add('btn', 'btn-edit');
        updateButton.innerText = 'Update';
        updateButton.onclick = () => this.updateBrand(params.data);

        // DELETE BUTTON
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-delete');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => this.deleteBrand(params.data.brand_Id);

        container.appendChild(updateButton);
        container.appendChild(deleteButton);

        return container;
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(
    private brandService: LoginServices,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadBrandList();

    this.addForm = this.fb.group({
      brandName: ['', Validators.required],
      brandDesc: ['']
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('rowData', this.brandList);
  }

  loadBrandList() {
    this.brandService.getBrandList().subscribe({
      next: (res: any) => {
        this.brandList = res.data || res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.brandList);
        }
      },
      error: err => console.error(err)
    });
  }

  insertBrand() {
    if (this.addForm.invalid) {
      alert('Brand Name is required');
      return;
    }

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      brand_name: this.addForm.value.brandName,
      brand_desc: this.addForm.value.brandDesc,
      created_by: userobj.user_id,
      created_date: new Date(),
      modified_by: userobj.user_id,
      updated_date: new Date()
    };

    this.brandService.insertBrand(payload).subscribe({
      next: () => {
        alert('Brand added successfully');
        this.addForm.reset();
        this.loadBrandList();
      },
      error: err => {
        const errorMsg = err.error?.errorMessage || 'Error occurred';
        alert(errorMsg);
      }
    });
  }

  updateBrand(row: any) {
    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      brand_id: row.brand_Id,
      brand_name: row.brand_Name,
      brand_desc: row.brand_Desc,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.brandService.updateBrand(payload).subscribe({
      next: () => {
        alert('Brand updated successfully');
        this.loadBrandList();
      },
      error: err => {
        const errorMsg = err.error?.errorMessage || 'Error occurred';
        alert(errorMsg);
        this.loadBrandList();
      }
    });
  }

  deleteBrand(id: number) {
    if (!confirm('Are you sure?')) return;

    this.brandService.deleteBrand(id).subscribe({
      next: () => {
        alert('Brand deleted successfully');
        this.loadBrandList();
      },
      error: err => {
        const errorMsg = err.error?.errorMessage || 'Error occurred';
        alert(errorMsg);
      }
    });
  }
}