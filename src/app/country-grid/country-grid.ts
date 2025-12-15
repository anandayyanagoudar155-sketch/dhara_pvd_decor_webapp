
import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { LoginServices,Company,FinancialYear } from '../services/login-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-country-grid',
  standalone: false,
  templateUrl: './country-grid.html',
  styleUrl: './country-grid.css',
})
export class CountryGrid implements OnInit {

  gridApi!: GridApi;
  countryList: any[] = [];
  addForm!: FormGroup;

columnDefs = [
  { headerName: 'Country ID', field: 'country_id', flex: 1, minWidth: 120 },

  { headerName: 'Country Name', field: 'country_name', editable: true, flex: 2, minWidth: 200 },

  {
    headerName: 'Actions',
    flex: 1,
    minWidth: 180,
    cellRenderer: (params: any) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.gap = '6px';

      // UPDATE BUTTON
      const updateButton = document.createElement('button');
       updateButton.classList.add('btn', 'btn-edit');
      updateButton.innerText = 'Update';
      updateButton.onclick = () => this.updateCountry(params.data);

      // DELETE BUTTON
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-delete');
      deleteButton.innerText = 'Delete';
      deleteButton.onclick = () => this.deleteCountry(params.data.country_id);

      container.appendChild(updateButton);
      container.appendChild(deleteButton);

      return container;
    }
  }
];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private countryService: LoginServices,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadCountryList();

    this.addForm = this.fb.group({
      countryName: ['', Validators.required]
    });
  }

onGridReady(params: any) {
  this.gridApi = params.api;
  this.gridApi.setGridOption('rowData', this.countryList);
}

  loadCountryList() {
    this.countryService.getCountryList().subscribe({
      next: (res: any) => {
        this.countryList = res.data || res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.countryList);
        }
      },
      error: err => console.error(err)
    });
  }

  // onCellClicked(event: any) {
  //   const row = event.data;

  //   if (event.event.target.classList.contains('update-btn')) {
  //     this.updateCountry(row);
  //   }

  //   if (event.event.target.classList.contains('delete-btn')) {
  //     this.deleteCountry(row.countryId);
  //   }
  // }

  updateCountry(row: any) {

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
      country_id: row.country_id,
      country_name: row.country_name,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id,

    };

    this.countryService.updateCountry(payload).subscribe({
      next: () => {
        alert('Country updated successfully');
        this.loadCountryList();
      },
      error: err =>{ 
      console.error(err)
      const errorMsg = err.error.errorMessage;
      alert(errorMsg);
      this.loadCountryList();
      }
    });
  }

  deleteCountry(id: number) {
    if (!confirm("Are you sure?")) return;

    this.countryService.deleteCountry(id).subscribe({
      next: () => {
        alert('Country deleted successfully');
        this.loadCountryList();
      },
      error: err =>{ 
      console.error(err)
      const errorMsg = err.error.errorMessage;
      alert(errorMsg);
      }
    });
  }

  insertCountry() {
    if (this.addForm.invalid) {
      alert("Country Name is required");
      return;
    }

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = JSON.parse(sessiondata!);

    const payload = {
    country_name: this.addForm.value.countryName,
    created_by: userobj.user_id,
    created_date: new Date(),
    modified_by: userobj.user_id,
    updated_date: new Date()
    };

    this.countryService.insertCountry(payload).subscribe({
      next: () => {
        alert('Country added successfully');
        this.addForm.reset();
        this.loadCountryList();
      },
      error: err =>{ 
      console.error(err)
      const errorMsg = err.error.errorMessage;
      alert(errorMsg);
      }
      
    });
  }
}
