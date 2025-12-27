import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-transtype-grid',
  standalone: false,
  templateUrl: './transtype-grid.html',
  styleUrl: './transtype-grid.css',
})
export class TranstypeGrid implements OnInit {

  gridApi!: GridApi;
  transTypeList: any[] = [];
  addForm!: FormGroup;

  columnDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'trans_id',
      minWidth: 100,
      flex: 1
    },
    {
      headerName: 'Transaction Type Name',
      field: 'transtype_name',
      editable: true,
      flex: 2
    },
    {
      headerName: 'Description',
      field: 'transtype_desc',
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
        updateBtn.onclick = () => this.updateTransType(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteTransType(params.data.trans_id);

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
    this.loadTransTypeList();

    this.addForm = this.fb.group({
      transtypeName: ['', Validators.required],
      transtypeDesc: ['']
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadTransTypeList() {
    this.service.getTransTypeList().subscribe({
      next: res => {
        this.transTypeList = res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.transTypeList);
        }
      },
      error: err => console.error(err)
    });
  }

  insertTransType() {
    if (this.addForm.invalid) {
      alert('Transaction type name is required');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);
    const formVal = this.addForm.getRawValue();

    const payload = {
      trans_id: 0,
      transtype_name: formVal.transtypeName,
      transtype_desc: formVal.transtypeDesc,
      created_date: new Date(),
      updated_date: new Date(),
      created_by: userobj.user_id,
      modified_by: userobj.user_id
    };

    this.service.insertTransType(payload).subscribe({
      next: () => {
        alert('Transaction type added successfully');
        this.addForm.reset();
        this.loadTransTypeList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }

  updateTransType(row: any) {
    if (!row.transtype_name) {
      alert('Transaction type name cannot be empty');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      trans_id: row.trans_id,
      transtype_name: row.transtype_name,
      transtype_desc: row.transtype_desc,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.service.updateTransType(payload).subscribe({
      next: () => {
        alert('Transaction type updated successfully');
        this.loadTransTypeList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
        this.loadTransTypeList();
      }
    });
  }

  deleteTransType(id: number) {
    if (!confirm('Are you sure you want to delete this transaction type?')) return;

    this.service.deleteTransType(id).subscribe({
      next: () => {
        alert('Transaction type deleted successfully');
        this.loadTransTypeList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }
}
