import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import { LoginServices,MonthList } from '../services/login-services';

@Component({
  selector: 'app-month-grid',
  standalone: false,
  templateUrl: './month-grid.html',
  styleUrl: './month-grid.css',
})
export class MonthGrid implements OnInit {

  gridApi!: GridApi;
  monthList: MonthList[] = [];

  constructor(
    private svc: LoginServices,
    private router: Router
  ) {}

  columnDefs: ColDef[] = [

     { headerName: 'Month ID', field: 'month_id', minWidth: 110 },

    { headerName: 'Month Name', field: 'month_name', minWidth: 200 },

    // {
    //   headerName: 'Start Date',
    //   field: 'start_date',
    //   minWidth: 150
    // },
    // {
    //   headerName: 'End Date',
    //   field: 'end_date',
    //   minWidth: 150
    // },
    // {
    //   headerName: 'Actions',
    //   minWidth: 160,
    //   cellRenderer: (params: any) => {

    //     const div = document.createElement('div');
    //     div.style.display = 'flex';
    //     div.style.gap = '8px';

    //     const editBtn = document.createElement('button');
    //     editBtn.className = 'btn btn-edit';
    //     editBtn.innerText = 'Update';
    //     editBtn.onclick = () =>
    //       this.prepareForEdit(params.data.month_id);

    //     const deleteBtn = document.createElement('button');
    //     deleteBtn.className = 'btn btn-delete';
    //     deleteBtn.innerText = 'Delete';
    //     deleteBtn.onclick = () =>
    //       this.deleteMonth(params.data.month_id);

    //     div.appendChild(editBtn);
    //     div.appendChild(deleteBtn);

    //     return div;
    //   }
    // }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1
  };

  ngOnInit(): void {
    this.loadMonthList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadMonthList() {
    this.svc.getMonthList().subscribe({
      next: res => {
        this.monthList = res || [];
      },
      error: err => console.error(err)
    });
  }

  // prepareForEdit(monthId: number) {
  //   this.router.navigate(['/month/edit', monthId]);
  // }

  // deleteMonth(monthId: number) {
  //   if (!confirm('Are you sure you want to delete this month?')) return;

  //   this.svc.deleteMonth(monthId).subscribe({
  //     next: () => {
  //       alert('Month deleted successfully');
  //       this.loadMonthList();
  //     },
  //     error: err => {
  //       console.error(err);
  //       alert(err?.error?.errorMessage || 'Delete failed');
  //     }
  //   });
  // }
}
