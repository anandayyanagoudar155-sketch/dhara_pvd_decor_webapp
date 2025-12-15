import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef, ICellRendererParams, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

interface UserDetails {
  user_details_id: number;
  user_name: string;
  comp_name: string;
  fin_year_name: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
  modified_by: string;
}

@Component({
  selector: 'app-userdetails-grid',
  standalone: false,
  templateUrl: './userdetails-grid.html',
  styleUrl: './userdetails-grid.css',
})
export class UserdetailsGrid implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  private gridApi!: GridApi;
  userDetailsList: UserDetails[] = [];

  columnDefs: ColDef[] = [
    { field: 'user_details_id', headerName: 'ID', sortable: true, filter: true },
    { field: 'user_name', headerName: 'User Name', sortable: true, filter: true },
    { field: 'comp_name', headerName: 'Company', sortable: true, filter: true },
    { field: 'fin_year_name', headerName: 'Financial Year', sortable: true, filter: true },
    { field: 'is_active', headerName: 'Active', sortable: true, filter: true },
    { field: 'created_date', headerName: 'Created Date', sortable: true, filter: true },
    { field: 'updated_date', headerName: 'Updated Date', sortable: true, filter: true },
    { field: 'modified_by', headerName: 'Modified By', sortable: true, filter: true },

    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: ICellRendererParams) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '8px';

        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-edit');
        editBtn.innerText = 'Edit';
        editBtn.addEventListener('click', () => {
          this.prepareForEdit(params.data as UserDetails);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', () => {
          this.prepareForDelete(params.data as UserDetails);
        });

        container.appendChild(editBtn);
        container.appendChild(deleteBtn);
        return container;
      },
      width: 150,
      sortable: false,
      filter: false,
      suppressSizeToFit: true,
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 120,
  };

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUserDetails();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadUserDetails() {
    this.http.get<UserDetails[]>('https://localhost:7046/api/User/userdetails_list')
      .subscribe({
        next: (res) => {
          this.userDetailsList = res;
          this.cdr.detectChanges();

          if (this.gridApi) {
            this.gridApi.refreshClientSideRowModel('filter');
            this.gridApi.redrawRows();
          }
        },
        error: (err) => {
          console.error('Error loading user details:', err);
          alert('Failed to load data');
        }
      });
  }

  prepareForDelete(rowData: UserDetails) {
    this.http.delete(`https://localhost:7046/api/User/delete_userdetails/${rowData.user_details_id}`)
      .subscribe({
        next: () => {
          alert('User Deleted Successfully');
          this.loadUserDetails();
        },
        error: (err) => {
          console.error('Error deleting:', err);
          const errorMsg = err.error.errorMessage;
          alert(errorMsg);
        }
      });
  }

  prepareForEdit(rowData: UserDetails) {
    this.router.navigate(['/userdetailedit', rowData.user_details_id]);
  }
}