import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { CityService } from '../services/city.service';
// import { StateDropdown, CityRow } from '../models/city.model';
import { LoginServices,StateDropdown,CountryDropdown,CityRow } from '../services/login-services';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-city-grid',
  standalone: false,
  templateUrl: './city-grid.html',
  styleUrl: './city-grid.css',
})
export class CityGrid implements OnInit {

  gridApi!: GridApi;
  cityList: CityRow[] = [];
  states: StateDropdown[] = [];
  countries: CountryDropdown[] = [];


  addForm!: FormGroup;

  stateControl = new FormControl<StateDropdown | string | null>(null);
  filteredStates$!: Observable<StateDropdown[]>;

  countryControl = new FormControl<CountryDropdown | string | null>(null);
  filteredCountries$!: Observable<CountryDropdown[]>;

  columnDefs: ColDef[] = [
    { headerName: 'City ID', field: 'city_id', flex: 1, minWidth: 100 },
    { headerName: 'City Name', field: 'city_name', editable: true, flex: 2, minWidth: 180 },

    {
      headerName: 'Country',
      field: 'country_id',
      flex: 2,
      minWidth: 220,
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '6px 8px';

        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.text = params.data?.country_name || '-- Select Country --';
        select.appendChild(defaultOpt);

        this.countries.forEach(c => {
          const opt = document.createElement('option');
          opt.value = String(c.country_id);
          opt.text = c.country_name;

          if (params.data.country_id === c.country_id) {
            opt.selected = true;
          }

          select.appendChild(opt);
        });

        select.onchange = () => {
          const countryId = Number(select.value);
          const country = this.countries.find(c => c.country_id === countryId);

          // set country on row
          params.data.country_id = country ? country.country_id : null;
          params.data.country_name = country ? country.country_name : null;

          // reset state
          params.data.state_id = null;
          params.data.state_name = null;

          // load states for THIS ROW ONLY
          this.svc.getStates(countryId).subscribe(states => {
            params.data._states = states || [];
            this.gridApi.refreshCells({ rowNodes: [params.node], columns: ['state_id'] });
          });
        };

        return select;
      }
    },

   {
      headerName: 'State',
      field: 'state_id',
      flex: 2,
      minWidth: 220,
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '6px 8px';

        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.text = params.data?.state_name || '-- Select State --';
        select.appendChild(defaultOpt);

        const rowStates: StateDropdown[] = params.data._states || [];

        rowStates.forEach(s => {
          const opt = document.createElement('option');
          opt.value = String(s.state_id);
          opt.text = s.state_name;

          if (params.data.state_id === s.state_id) {
            opt.selected = true;
          }

          select.appendChild(opt);
        });

        select.onchange = () => {
          const stateId = Number(select.value);
          const state = rowStates.find(s => s.state_id === stateId);

          params.data.state_id = state ? state.state_id : null;
          params.data.state_name = state ? state.state_name : null;
        };

        return select;
      }
    },

    {
      headerName: 'Actions',
      flex: 1,
      minWidth: 160,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.gap = '8px';

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('btn', 'btn-edit');
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.updateCity(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteCity(params.data.city_id);

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

  constructor(
    private fb: FormBuilder,
    private svc: LoginServices
  ) {}

  // ---------------- INITIAL LOAD ---------------- //
  ngOnInit(): void {
    this.addForm = this.fb.group({
      state: ['', Validators.required],
      cityName: ['', Validators.required]
    });

    // this.loadStates();
    // this.loadCityList();

    // this.filteredStates$ = this.stateControl.valueChanges.pipe(
    //   startWith(''),
    //   map(val => this._filterStates(val))
    // );


  this.loadCountries();
  this.loadCityList();


  this.filteredCountries$ = this.countryControl.valueChanges.pipe(
    startWith(''),
    map(val => this._filterCountries(val))
  );


  this.filteredStates$ = this.stateControl.valueChanges.pipe(
    startWith(''),
    map(val => this._filterStates(val))
  );
  }

  private _filterStates(value: string | StateDropdown | null): StateDropdown[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.state_name.toLowerCase() || '';

    return this.states.filter(s =>
      s.state_name.toLowerCase().includes(filterValue)
    );
  }

    displayState(state: StateDropdown | string | null): string {
    return typeof state === 'string'
      ? state
      : state?.state_name || '';
  }

  private _filterCountries(value: string | CountryDropdown | null): CountryDropdown[] {
  const filterValue =
    typeof value === 'string'
      ? value.toLowerCase()
      : value?.country_name.toLowerCase() || '';

  return this.countries.filter(c =>
    c.country_name.toLowerCase().includes(filterValue)
  );
}

displayCountry(country: CountryDropdown | string | null): string {
  return typeof country === 'string'
    ? country
    : country?.country_name || '';
}



  

  onGridReady(params: any) {
    this.gridApi = params.api;
    if (this.cityList.length) {
      this.gridApi.setGridOption('rowData', this.cityList);
    }
  }

  // ---------------- LOAD DATA ---------------- //

  loadCountries() {
  this.svc.getCountries().subscribe({
    next: (res) => this.countries = res || [],
    error: err => console.error(err)
  });
}

onCountrySelected(country: CountryDropdown) {
  this.countryControl.setValue(country);
  this.stateControl.setValue(null);
  this.states = [];

  this.svc.getStates(country.country_id).subscribe({
    next: (s) => this.states = s || [],
    error: err => console.error(err)
  });
}

  loadStates() {
    this.svc.getStates(0).subscribe({
      next: (s) => (this.states = s || []),
      error: (err) => console.error(err)
    });
  }

  loadCityList() {
    this.svc.getCityList().subscribe({
      next: (res) => {
        this.cityList = res || [];
        if (this.gridApi) this.gridApi.setGridOption('rowData', this.cityList);
      },
      error: (err) => console.error(err)
    });
  }

  // ---------------- UPDATE CITY ---------------- //
  updateCity(row: CityRow) {
    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    if (!row.state_id) {
      alert('Please select a State first.');
      return;
    }

    const payload = {
      city_id: row.city_id,
      city_name: row.city_name,
      state_id: row.state_id,
      created_by: row.created_by ?? 0,
      created_date: row.created_date ?? null,
      modified_by: user.user_id,
      updated_date: new Date()
    };

    this.svc.updateCity(payload).subscribe({
      next: () => {
        alert('City updated successfully');
        this.loadCityList();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Update failed');
        this.loadCityList();
      }
    });
  }

  // ---------------- DELETE CITY ---------------- //
  deleteCity(id: number) {
    if (!confirm('Are you sure you want to delete?')) return;

    this.svc.deleteCity(id).subscribe({
      next: () => {
        alert('City deleted successfully');
        this.loadCityList();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Delete failed');
      }
    });
  }

  // ---------------- INSERT CITY ---------------- //
  insertCity() {
    if (this.addForm.invalid) {
      alert('Please fill all fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    let selectedStateId: number | null = null;

    const ctrlVal = this.stateControl.value;

    if (ctrlVal && typeof ctrlVal === 'object') {
      selectedStateId = ctrlVal.state_id;
    } else if (typeof ctrlVal === 'string') {
      const match = this.states.find(s => s.state_name.toLowerCase() === ctrlVal.toLowerCase());
      selectedStateId = match ? match.state_id : null;
    }

    if (!selectedStateId) {
      alert('Please select a valid State');
      return;
    }

    if (!this.countryControl.value || typeof this.countryControl.value === 'string') {
    alert('Please select a country');
    return;
    }

    const payload = {
      city_name: this.addForm.value.cityName,
      state_id: selectedStateId,
      created_by: user.user_id,
      created_date: new Date(),
      modified_by: user.user_id,
      updated_date: new Date()
    };

    this.svc.insertCity(payload).subscribe({
      next: () => {
        alert('City added successfully');
        // this.addForm.reset();
        // this.stateControl.setValue(null);
        // this.loadCityList();
          this.addForm.reset();
          this.countryControl.setValue(null);
          this.stateControl.setValue(null);
          this.states = [];
          this.loadCityList();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Insert failed');
        this.loadCityList();
      }
    });
  }

  selectStateFromAutocomplete(state: StateDropdown) {
    this.stateControl.setValue(state);
    this.addForm.patchValue({ state: state.state_id });
  }
}