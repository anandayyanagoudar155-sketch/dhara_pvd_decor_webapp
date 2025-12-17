import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import { LoginServices,FinYearList } from '../services/login-services';

@Component({
  selector: 'app-finyear-grid',
  standalone: false,
  templateUrl: './finyear-grid.html',
  styleUrl: './finyear-grid.css',
})
export class FinyearGrid implements OnInit {

  gridApi!: GridApi;
  finYearList: FinYearList[] = [];;

  constructor(private svc: LoginServices, private router: Router) {}

  columnDefs: ColDef[] = [
    { headerName: 'Fin Year ID', field: 'fin_year_id', flex: 1 },
    { headerName: 'Financial Year', field: 'fin_name', flex: 1 },
    { headerName: 'Short FinYear Name', field: 'short_fin_year', flex: 1 },
    { headerName: 'Start Date', field: 'year_start', flex: 1 },
    { headerName: 'End Date', field: 'year_end', flex: 1 },
    // { headerName: 'Status', field: 'is_active', minWidth: 120 },

    {
      headerName: 'Actions',
      width: 180,
      suppressSizeToFit: true,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.gap = '8px';

        const updateBtn = document.createElement('button');
        updateBtn.className = 'btn btn-edit';
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.editFinYear(params.data.fin_year_id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteFinYear(params.data.fin_year_id);

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
    this.loadFinYearList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    if (this.finYearList.length) {
      this.gridApi.setGridOption('rowData', this.finYearList);
    }
  }

  loadFinYearList() {
    this.svc.getFinYearList().subscribe({
      next: res => {
        this.finYearList = res || [];
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.finYearList);
        }
      },
      error: err => console.error(err)
    });
  }

  editFinYear(finYearId: number) {
    this.router.navigate(['/finyear/edit', finYearId]);
  }

  deleteFinYear(finYearId: number) {
    if (!confirm('Are you sure you want to delete this financial year?')) return;

    this.svc.deleteFinYear(finYearId).subscribe({
      next: () => {
        alert('Financial Year deleted successfully');
        this.loadFinYearList(); 
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Delete failed');
      }
    });
  }
}
