import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-unit-grid',
  standalone: false,
  templateUrl: './unit-grid.html',
  styleUrl: './unit-grid.css',
})
export class UnitGrid implements OnInit {

  gridApi!: GridApi;
  unitList: any[] = [];
  addForm!: FormGroup;

  columnDefs: ColDef[] = [
    {
      headerName: 'Unit ID',
      field: 'unitId',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Unit Name',
      field: 'unitName',
      editable: true,
      flex: 2
    },
    {
      headerName: 'Unit Description',
      field: 'unitDesc',
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
        updateBtn.onclick = () => this.updateUnit(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteUnit(params.data.unitId);

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
    private unitService: LoginServices,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUnitList();

    this.addForm = this.fb.group({
      unitName: ['', Validators.required],
      unitDesc: ['']
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('rowData', this.unitList);
  }

  loadUnitList() {
    this.unitService.getUnitList().subscribe({
      next: res => {
        this.unitList = res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.unitList);
        }
      },
      error: err => console.error(err)
    });
  }

  // =============================
  // INSERT UNIT
  // =============================
  insertUnit() {
    if (this.addForm.invalid) {
      alert('Unit name is required');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);
    const formVal = this.addForm.getRawValue();

    const payload = {
      unitName: formVal.unitName,
      unitDesc: formVal.unitDesc,
      isActive: true,
      created_by: userobj.user_id,
      created_date: new Date(),
      modified_by: userobj.user_id,
      updated_date: new Date()
    };

    this.unitService.insertUnit(payload).subscribe({
      next: () => {
        alert('Unit added successfully');
        this.addForm.reset();
        this.loadUnitList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }

  // =============================
  // UPDATE UNIT
  // =============================
  updateUnit(row: any) {
    if (!row.unitName) {
      alert('Unit name cannot be empty');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      unitId: row.unitId,
      unitName: row.unitName,
      unitDesc: row.unitDesc,
      isActive:row.isActive,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.unitService.updateUnit(payload).subscribe({
      next: () => {
        alert('Unit updated successfully');
        this.loadUnitList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
        this.loadUnitList();
      }
    });
  }

  // =============================
  // DELETE UNIT
  // =============================
  deleteUnit(id: number) {
    if (!confirm('Are you sure you want to delete this unit?')) return;

    this.unitService.deleteUnit(id).subscribe({
      next: () => {
        alert('Unit deleted successfully');
        this.loadUnitList();
      },
      error: err =>
        alert(err.error?.errorMessage || 'Error occurred')
    });
  }
}