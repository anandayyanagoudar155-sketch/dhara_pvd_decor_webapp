import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { LoginServices, CompanyList } from '../services/login-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-grid',
  standalone: false,
  templateUrl: './company-grid.html',
  styleUrl: './company-grid.css',
})
export class CompanyGrid implements OnInit {

  gridApi!: GridApi;
  companyList: CompanyList[] = [];

  constructor(private svc: LoginServices,private router: Router) {}

  columnDefs: ColDef[] = [
    { headerName: 'Company ID', field: 'comp_id', minWidth: 110 },

    { headerName: 'Company Code', field: 'comp_code', minWidth: 140 },
    { headerName: 'Company Name', field: 'comp_name', minWidth: 220 },
    { headerName: 'Short Name', field: 'comp_short_name', minWidth: 150 },
    { headerName: 'Type', field: 'comp_type', minWidth: 130 },
    { headerName: 'Description', field: 'comp_desc', minWidth: 200 },

    { headerName: 'CIN', field: 'cin_number', minWidth: 160 },
    { headerName: 'GST', field: 'gst_number', minWidth: 160 },
    { headerName: 'PAN', field: 'pan_number', minWidth: 150 },

    { headerName: 'Contact Person', field: 'contperson_name', minWidth: 180 },
    { headerName: 'Email', field: 'contact_email', minWidth: 220 },
    { headerName: 'Phone', field: 'contact_phone', minWidth: 160 },

    { headerName: 'Address Line 1', field: 'address_line1', minWidth: 250 },
    { headerName: 'Address Line 2', field: 'address_line2', minWidth: 250 },

    { headerName: 'City', field: 'city_name', minWidth: 160 },
    { headerName: 'Pincode', field: 'pincode', minWidth: 120 },

    {
      headerName: 'Actions',
      minWidth: 160,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.gap = '8px';

        const updateBtn = document.createElement('button');
        updateBtn.className = 'btn btn-edit';
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.prepareForEdit(params.data.comp_id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteCompany(params.data.comp_id);

        div.appendChild(updateBtn);
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
    this.loadCompanyList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    if (this.companyList.length) {
      this.gridApi.setGridOption('rowData', this.companyList);
    }
  }

  loadCompanyList() {
    this.svc.getCompanyList().subscribe({
      next: res => {
        this.companyList = res || [];
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.companyList);
        }
      },
      error: err => console.error(err)
    });
  }


  prepareForEdit(compId: number) {
    this.router.navigate(['/company/edit', compId]);
  }

  deleteCompany(compId: number) {
    if (!confirm('Are you sure you want to delete this company?')) return;

    this.svc.deleteCompany(compId).subscribe({
      next: () => {
        alert('Company deleted successfully');
        this.loadCompanyList(); 
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Delete failed');
      }
    });
  }
}
