import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';

@Component({
  selector: 'app-colour-grid',
  standalone: false,
  templateUrl: './colour-grid.html',
  styleUrl: './colour-grid.css',
})
export class ColourGrid implements OnInit {

  gridApi!: GridApi;
  colourList: any[] = [];
  addForm!: FormGroup;

  columnDefs = [
    { headerName: 'Colour ID', field: 'colourId', flex: 1, minWidth: 120 },

    { headerName: 'Colour Name', field: 'colourName', editable: true, flex: 2, minWidth: 200 },

    // {
    //   headerName: 'Active',
    //   field: 'isActive',
    //   editable: true,
    //   flex: 1,
    //   minWidth: 120
    // },

    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '6px';

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('btn', 'btn-edit');
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.updateColour(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteColour(params.data.colourId);

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
    private colourService: LoginServices,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadColourList();

    this.addForm = this.fb.group({
      colourName: ['', Validators.required]
      // isActive: [true]
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('rowData', this.colourList);
  }

  loadColourList() {
    this.colourService.getColourList().subscribe({
      next: res => {
        this.colourList = res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.colourList);
        }
      },
      error: err => console.error(err)
    });
  }

  insertColour() {
    if (this.addForm.invalid) {
      alert('Colour Name is required');
      return;
    }

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      colourName: this.addForm.value.colourName,
      isActive: true,
      created_by: userobj.user_id,
      modified_by: userobj.user_id,
      created_date: new Date(),
      updated_date: new Date()
    };

    this.colourService.insertColour(payload).subscribe({
      next: () => {
        alert('Colour added successfully');
        this.addForm.reset({ isActive: true });
        this.loadColourList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
      }
    });
  }

  updateColour(row: any) {
    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      colourId: row.colourId,
      colourName: row.colourName,
      isActive: row.isActive,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.colourService.updateColour(payload).subscribe({
      next: () => {
        alert('Colour updated successfully');
        this.loadColourList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
        this.loadColourList();
      }
    });
  }

  deleteColour(id: number) {
    if (!confirm('Are you sure?')) return;

    this.colourService.deleteColour(id).subscribe({
      next: () => {
        alert('Colour deleted successfully');
        this.loadColourList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
      }
    });
  }
}