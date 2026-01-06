import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import {
  LoginServices,
  Customer_List
} from '../services/login-services';

@Component({
  selector: 'app-customer-grid',
  standalone: false,
  templateUrl: './customer-grid.html',
  styleUrl: './customer-grid.css',
})
export class CustomerGrid implements OnInit {

  gridApi!: GridApi;
  customerList: Customer_List[] = [];

  constructor(
    private customerService: LoginServices,
    private router: Router
  ) {}

   columnDefs: ColDef[] = [
  { headerName: 'Customer ID', field: 'customer_Id', minWidth: 120 },
  { headerName: 'Customer Name', field: 'customer_Name', minWidth: 220 },
  { headerName: 'Prefix', field: 'prefix', minWidth: 100 },
  { headerName: 'Gender', field: 'gender', minWidth: 100 },
  { headerName: 'Phone Number', field: 'phonenumber', minWidth: 160 },
  { headerName: 'City', field: 'city_Name', minWidth: 160 },
  { headerName: 'Address', field: 'cust_Address', minWidth: 260 },
  { headerName: 'Email', field: 'email_Id', minWidth: 220 },
  { headerName: 'DOB', field: 'dob', minWidth: 140 },
  { headerName: 'Aadhaar No', field: 'aadhaar_Number', minWidth: 180 },
  { headerName: 'License No', field: 'license_Number', minWidth: 180 },
  { headerName: 'PAN No', field: 'pan_Number', minWidth: 160 },
  { headerName: 'GST No', field: 'gst_Number', minWidth: 180 },
  { headerName: 'Notes', field: 'customer_Notes', minWidth: 240 },

  {
    headerName: 'Actions',
    minWidth: 170,
    cellRenderer: (params: any) => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.gap = '8px';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-edit';
      editBtn.innerText = 'Update';
      editBtn.onclick = () =>
        this.prepareForEdit(params.data.customer_Id);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-delete';
      deleteBtn.innerText = 'Delete';
      deleteBtn.onclick = () =>
        this.deleteCustomer(params.data.customer_Id);

      div.appendChild(editBtn);
      div.appendChild(deleteBtn);

      return div;
    }
  }
];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  ngOnInit(): void {
    this.loadCustomerList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    if (this.customerList.length) {
      this.gridApi.setGridOption('rowData', this.customerList);
    }
  }

  loadCustomerList() {
    this.customerService.getCustomerList().subscribe({
      next: res => {
        this.customerList = res || [];
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.customerList);
        }
      },
      error: err => console.error(err)
    });
  }

  prepareForEdit(customerId: number) {
    this.router.navigate(['/customer/edit', customerId]);
  }

  deleteCustomer(customerId: number) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        alert('Customer deleted successfully');
        this.loadCustomerList();
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Delete failed');
      }
    });
  }
}
