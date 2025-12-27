import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-paytype-grid',
  standalone: false,
  templateUrl: './paytype-grid.html',
  styleUrl: './paytype-grid.css',
})
export class PaytypeGrid implements OnInit {

  gridApi!: GridApi;
  paytypeList: any[] = [];
  addForm!: FormGroup;

  columnDefs: ColDef[] = [
    {
      headerName: 'Paytype ID',
      field: 'paytype_Id',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Paytype Name',
      field: 'paytype_Name',
      editable: true,
      flex: 2
    },
    {
      headerName: 'Paytype Description',
      field: 'paytype_Desc',
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
        updateBtn.onclick = () => this.updatePaytype(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deletePaytype(params.data.paytype_Id);

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
    private paytypeService: LoginServices,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPaytypeList();

    this.addForm = this.fb.group({
      paytypeName: ['', Validators.required],
      paytypeDesc: ['']
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadPaytypeList() {
    this.paytypeService.getPaytypeList().subscribe({
      next: res => {
        this.paytypeList = res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.paytypeList);
        }
      },
      error: err => console.error(err)
    });
  }

  insertPaytype() {
    if (this.addForm.invalid) {
      alert('Paytype name is required');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);
    const formVal = this.addForm.getRawValue();

    const payload = {
      paytype_Id: 0,
      paytype_Name: formVal.paytypeName,
      paytype_Desc: formVal.paytypeDesc,
      created_date: new Date(),
      updated_date: new Date(),
      created_by: userobj.user_id,
      modified_by: userobj.user_id
    };

    this.paytypeService.insertPaytype(payload).subscribe({
      next: () => {
        alert('Paytype added successfully');
        this.addForm.reset();
        this.loadPaytypeList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }

  updatePaytype(row: any) {
    if (!row.paytype_Name) {
      alert('Paytype name cannot be empty');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      paytype_Id: row.paytype_Id,
      paytype_Name: row.paytype_Name,
      paytype_Desc: row.paytype_Desc,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.paytypeService.updatePaytype(payload).subscribe({
      next: () => {
        alert('Paytype updated successfully');
        this.loadPaytypeList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
        this.loadPaytypeList();
      }
    });
  }

  deletePaytype(id: number) {
    if (!confirm('Are you sure you want to delete this paytype?')) return;

    this.paytypeService.deletePaytype(id).subscribe({
      next: () => {
        alert('Paytype deleted successfully');
        this.loadPaytypeList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }
}
