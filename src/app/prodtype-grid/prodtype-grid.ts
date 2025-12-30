import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-prodtype-grid',
  standalone: false,
  templateUrl: './prodtype-grid.html',
  styleUrl: './prodtype-grid.css',
})
export class ProdtypeGrid implements OnInit {

  gridApi!: GridApi;
  prodTypeList: any[] = [];
  addForm!: FormGroup;

  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'prodtype_Id',
      minWidth: 100,
      flex: 1
    },
    {
      headerName: 'Product Type Name',
      field: 'prodtype_Name',
      editable: true,
      flex: 2
    },
    {
      headerName: 'Description',
      field: 'prodtype_Desc',
      editable: true,
      flex: 3
    },
    {
      headerName: 'Actions',
      minWidth: 200,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '6px';

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('btn', 'btn-edit');
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.updateProdtype(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteProdtype(params.data.prodtype_Id);

        container.appendChild(updateBtn);
        container.appendChild(deleteBtn);

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
    private service: LoginServices,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProdtypeList();

    this.addForm = this.fb.group({
      prodtypeName: ['', Validators.required],
      prodtypeDesc: ['']
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadProdtypeList() {
    this.service.getProdtypeList().subscribe({
      next: res => {
        this.prodTypeList = res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.prodTypeList);
        }
      },
      error: err => console.error(err)
    });
  }

  insertProdtype() {
    if (this.addForm.invalid) {
      alert('Product type name is required');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);
    const formVal = this.addForm.getRawValue();

    const payload = {
      prodtype_Id: 0,
      prodtype_Name: formVal.prodtypeName,
      prodtype_Desc: formVal.prodtypeDesc,
      created_date: new Date(),
      updated_date: new Date(),
      created_by: userobj.user_id,
      modified_by: userobj.user_id
    };

    this.service.insertProdtype(payload).subscribe({
      next: () => {
        alert('Product type added successfully');
        this.addForm.reset();
        this.loadProdtypeList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }

  updateProdtype(row: any) {
    if (!row.prodtype_Name) {
      alert('Product type name cannot be empty');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      prodtype_Id: row.prodtype_Id,
      prodtype_Name: row.prodtype_Name,
      prodtype_Desc: row.prodtype_Desc,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.service.updateProdtype(payload).subscribe({
      next: () => {
        alert('Product type updated successfully');
        this.loadProdtypeList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
        this.loadProdtypeList();
      }
    });
  }

  deleteProdtype(id: number) {
    if (!confirm('Are you sure you want to delete this product type?')) return;

    this.service.deleteProdtype(id).subscribe({
      next: () => {
        alert('Product type deleted successfully');
        this.loadProdtypeList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }
}