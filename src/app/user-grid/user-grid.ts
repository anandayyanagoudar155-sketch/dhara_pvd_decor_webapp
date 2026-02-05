import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

interface User_List {
  user_id: number;
  user_name: string;
  user_password: string;
  user_role: string;
  is_login: boolean;
  created_Date: string;
  updated_Date: string;
}

@Component({
  selector: 'app-user-grid',
  standalone: false,
  templateUrl: './user-grid.html',
  styleUrl: './user-grid.css',
})
export class UserGrid implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  private gridApi!: GridApi;

  userList: User_List[] = [];

  columnDefs: ColDef[] = [
    { field: 'user_id', headerName: 'User ID', sortable: true, filter: true },
    { field: 'user_name', headerName: 'Username', sortable: true, filter: true },
    { field: 'user_password', headerName: 'Password', sortable: false, filter: false, hide: true },
    { field: 'user_role', headerName: 'Role', sortable: true, filter: true },
    { field: 'is_login', headerName: 'Is Login', sortable: true, filter: true, cellRenderer: (params: { value: any; }) => params.value ? 'Yes' : 'No' },
    { field: 'created_Date', headerName: 'Created Date', sortable: true, filter: true },
    { field: 'updated_Date', headerName: 'Updated Date', sortable: true, filter: true },

    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: ICellRendererParams) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '8px';

        // Edit button
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-edit');
        editButton.innerText = 'Edit';
        editButton.onclick = () => this.prepareForEdit(params.data as User_List);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-delete');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => this.prepareForDelete(params.data as User_List);

        container.appendChild(editButton);
        container.appendChild(deleteButton);

        return container;
      },
      width: 150,
      sortable: false,
      filter: false
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 120
  };

  constructor(private http: HttpClient, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsers();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadUsers() {
    this.http.get<User_List[]>('https://localhost:7046/api/User/user_list')
      .subscribe({
        next: (res) => {
          console.log("API RESPONSE:", res); 
          this.userList = res;
          this.cdr.detectChanges();

          if (this.gridApi) {
            this.gridApi.refreshClientSideRowModel('filter');
            this.gridApi.redrawRows();
          }
        },
        error: (err) => {
          console.error('Error fetching user list:', err);
          alert('Failed to load users. Please try again later.');
        }
      });
  }

  prepareForDelete(rowData: User_List) {
    this.http.delete(`https://localhost:7046/api/User/delete_user/${rowData.user_id}`)
      .subscribe({
        next: () => {
          alert('Deleted user with ID: ' + rowData.user_id);
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          const errorMsg = err.error.errorMessage;
          alert(errorMsg);
        }
      });
  }

  prepareForEdit(rowData: User_List) {
    this.router.navigate(['/useredit', rowData.user_id]);
  }
}
