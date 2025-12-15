import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginServices,CountryDropdown,StateRow } from '../services/login-services';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-state-grid',
  standalone: false,
  templateUrl: './state-grid.html',
  styleUrl: './state-grid.css',
})
export class StateGrid implements OnInit {
  gridApi!: GridApi;
  stateList: StateRow[] = [];
  countries: CountryDropdown[] = [];
  addForm!: FormGroup;
  countryControl = new FormControl('');
  filteredCountries$!: Observable<CountryDropdown[]>;

  columnDefs: ColDef[] = [
    { headerName: 'State ID', field: 'state_id', flex: 1, minWidth: 100 },
    { headerName: 'State Name', field: 'state_name', editable: true, flex: 2, minWidth: 180 },

    // Country column renders a select so user can change country inline
    {
      headerName: 'Country',
      field: 'country_id',
      flex: 2,
      minWidth: 220,
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '6px 8px';
        // add default option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.text = params.data?.country_name || '-- Select --';
        select.appendChild(defaultOpt);

        // populate countries from component
        (this.countries || []).forEach(c => {
          const opt = document.createElement('option');
          opt.value = String(c.country_id);
          opt.text = c.country_name;
          if (params.data && params.data.country_id == c.country_id) {
            opt.selected = true;
          }
          select.appendChild(opt);
        });

        // update the row's country_id / country_name on change
        select.onchange = () => {
          const selectedId = Number((select as HTMLSelectElement).value);
          const selected = this.countries.find(x => x.country_id === selectedId);
          params.data.country_id = selected ? selected.country_id : null;
          params.data.country_name = selected ? selected.country_name : null;
        };

        return select;
      }
    },

    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 170,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '8px';

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('btn', 'btn-edit');
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.updateState(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteState(params.data.state_id);

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
    private fb: FormBuilder,
    private svc: LoginServices
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      country: ['', Validators.required], // will hold country object or id (we use id)
      stateName: ['', [Validators.required, Validators.minLength(1)]]
    });

    // load data
    this.loadCountries();
    this.loadStateList();

    // setup filtered countries for autocomplete
    this.filteredCountries$ = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(val => this._filterCountries(val || ''))
    );
  }

  private _filterCountries(value: string): CountryDropdown[] {
    const filterValue = value.toString().toLowerCase();
    return this.countries.filter(c => c.country_name.toLowerCase().includes(filterValue));
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    // set initial row data (it will be updated when loadStateList completes)
    this.gridApi.setGridOption('rowData', this.stateList);
  }

  loadCountries() {
    this.svc.getCountries().subscribe({
      next: (res) => {
        this.countries = res || [];
      },
      error: err => console.error(err)
    });
  }

  loadStateList() {
    this.svc.getStateList().subscribe({
      next: (res) => {
        this.stateList = res || [];
        if (this.gridApi) this.gridApi.setGridOption('rowData', this.stateList);
      },
      error: err => console.error(err)
    });
  }

  // Update a row (called by Update button in Actions)
  updateState(row: StateRow) {
    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = sessiondata ? JSON.parse(sessiondata) : null;
    // ensure country_id exists
    const country_id = row.country_id ?? null;
    if (!country_id) {
      alert('Please select a country for this state before updating.');
      return;
    }

    const payload = {
      state_id: row.state_id,
      state_name: row.state_name,
      country_id: country_id,
      // send back original created fields if present (otherwise API will handle)
      created_by: row.created_by ?? 0,
      created_date: row.created_date ?? null,
      modified_by: userobj?.user_id ?? 0,
      updated_date: new Date()
    };

    this.svc.updateState(payload).subscribe({
      next: () => {
        alert('State updated successfully');
        this.loadStateList();
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Failed to update state');
        this.loadStateList();
      }
    });
  }

  // Delete state
  deleteState(id: number) {
    if (!confirm('Are you sure you want to delete this state?')) return;
    this.svc.deleteState(id).subscribe({
      next: () => {
        alert('State deleted successfully');
        this.loadStateList();
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Failed to delete state');
      }
    });
  }

  // Insert new state using form. Autocomplete countryControl is used to select country.
  insertState() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      alert('Please enter required fields.');
      return;
    }

    const sessiondata = sessionStorage.getItem('userobj');
    const userobj = sessiondata ? JSON.parse(sessiondata) : null;

    // countryControl value may be an id or a string; we resolve to id
    let selectedCountryId: number | null = null;
    const ctrlVal = this.countryControl.value;
    if (typeof ctrlVal === 'number') selectedCountryId = ctrlVal;
    else {
      // try to find by name
      const found = this.countries.find(c => c.country_name.toLowerCase() === (ctrlVal || '').toString().toLowerCase());
      selectedCountryId = found ? found.country_id : null;
    }

    if (!selectedCountryId) {
      alert('Please select a valid country.');
      return;
    }

    const payload = {
      state_name: this.addForm.value.stateName || this.addForm.value.stateName,
      country_id: selectedCountryId,
      created_by: userobj?.user_id ?? 0,
      created_date: new Date(),
      modified_by: userobj?.user_id ?? 0,
      updated_date: new Date()
    };

    this.svc.insertState(payload).subscribe({
      next: () => {
        alert('State added successfully');
        this.addForm.reset();
        this.countryControl.setValue('');
        this.loadStateList();
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Failed to add state');
      }
    });
  }

  // helper to set autocomplete selection when user picks option from list
  selectCountryFromAutocomplete(country: CountryDropdown) {
    this.countryControl.setValue(country.country_name);
    // also set underlying form control for country if used
    this.addForm.patchValue({ country: country.country_id });
  }
}