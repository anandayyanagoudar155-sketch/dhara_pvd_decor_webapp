import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServices,Company,FinancialYear } from '../services/login-services';
import { GridApi, Column } from 'ag-grid-community';
import { Subscription } from 'rxjs';

interface UserDetailsGridRow {
  user_details_id: number;
  user_id: number;
  comp_id: number;
  comp_name: string;
  fin_year_id: number;
  fin_year_name: string;
  is_active: boolean;
  created_date: string | Date | null;
  updated_date: string | Date | null;
  modified_by?: number;
}

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser implements OnInit {
  userForm!: FormGroup;
  private originalCreatedDate: Date | null = null;
  private userId: number = 0;

  // AG Grid
  gridApi!: GridApi;
  gridColApi!: Column;

  userDetailsGrid: UserDetailsGridRow[] = [];
  rowSelection: 'multiple' = 'multiple';
  columnDefs: any[] = [
    {
      headerName: 'Select',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      width: 80,
      suppressSizeToFit: true,
    },
    { headerName: 'Company', field: 'comp_name', flex: 1 },
    { headerName: 'Financial Year', field: 'fin_year_name', flex: 1 },
  ];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  addForm!: FormGroup;

  companies: Company[] = [];
  finYears: FinancialYear[] = [];


  private subs: Subscription[] = [];
  currentUserId: number = 0; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginServices: LoginServices
  ) {}

  ngOnInit(): void {
    const sessiondata = sessionStorage.getItem('userobj');
    if (sessiondata) {
      try {
        this.currentUserId = JSON.parse(sessiondata).user_id;
      } catch {
        this.currentUserId = 0;
      }
    }

    this.userForm = this.fb.group({
      User_id: [''],
      User_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      User_password: [''],
      User_role: ['', Validators.required],
      Is_login: [false]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUserData(this.userId);
      this.loadMultipleUserDetails(this.userId);
    }

    this.addForm = this.fb.group({
      // compId: ['', Validators.required],
      // finYearId: ['', Validators.required]

       compId: [''],
       finYearId: ['']
      
    });

    this.loadCompanies();
    this.loadFinYears();
  }

  loadUserData(userId: number) {
    this.loginServices.getUserById(userId).subscribe({
      next: (user: any) => {
        this.originalCreatedDate = user.created_Date ? new Date(user.created_Date) : null;
        this.userForm.patchValue({
          User_id: user.user_id,
          User_name: user.user_name,
          User_password: user.user_password,
          User_role: user.user_role,
          Is_login: user.is_login
        });
      },
      error: (err) => {
        alert('Failed to load user data.');
        console.error(err);
      }
    });
  }

    loadCompanies() {
    this.loginServices.getCompanies(0).subscribe({
      next: (res: any) => this.companies = res
    });
  }

  loadFinYears() {
    this.loginServices.getFinYears(0).subscribe({
      next: (res: any) => this.finYears = res
    });
  }

  loadMultipleUserDetails(userId: number) {
    this.loginServices.getMultipleUserDetails(userId).subscribe({
      next: (rows: UserDetailsGridRow[]) => {
        this.userDetailsGrid = (rows || []).map(r => ({ ...r,
          // is_active: r.is_active === undefined ? true : !!r.is_active,
          selected: true
        }));

        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.userDetailsGrid);
            setTimeout(() => {this.gridApi.selectAll();}, 50);
      }
      },
      error: (err) => {
        console.error('Failed to load user details grid data', err);
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColApi = params.columnApi;

    if (this.userDetailsGrid && this.userDetailsGrid.length) {
      this.gridApi.setGridOption('rowData', this.userDetailsGrid);
        setTimeout(() => {this.gridApi.selectAll();}, 50);
      
    }
  }

  onResetGridSelection() {
    if (this.gridApi) {
      this.gridApi.forEachNode(node => node.setSelected(true));
    }
  }

  onSaveUserDetails() {
     if (!this.gridApi) return;

  const selectedRows = this.gridApi.getSelectedRows();
  if (selectedRows.length === 0) {
    alert("Please select at least one row.");
    return;
  }

  this.loginServices.DeleteUserDetails(this.userId).subscribe({
    next: () => {

      selectedRows.forEach(row => {
        const payload = {
          User_id: this.userId,
          Comp_id: row.comp_id.toString(),
          Fin_year_id: row.fin_year_id.toString(),
          Is_active: true,
          Modified_by: this.userId,
          Created_date: new Date(),
          Updated_date: new Date()
        };

        this.loginServices.addUpdatedUserDetails(payload).subscribe({
          next: () => {},
          error: (err) => console.error(err)
        });
      });

      alert("User details updated successfully!");
      this.loadMultipleUserDetails(this.userId);
    },
    error: (err) => {
      console.error("Delete failed", err);
      alert("Failed to clear existing user details.");
    }
  });
}


  onUpdateUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;

    const payload = {
      User_id: formData.User_id,
      User_name: formData.User_name,
      User_password: formData.User_password,
      User_role: formData.User_role,
      Is_login: formData.Is_login,
      Created_Date: this.originalCreatedDate,
      Updated_Date: new Date()
    };

    this.loginServices.updateUser(payload).subscribe({
      next: (res) => {
        alert('User updated successfully!');
        //this.router.navigate(['/usergrid']);
        sessionStorage.removeItem('userobj'); // or sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.errorMessage || 'Failed to update user.');
      }
    });
  }


  onAddNewMapping() {
    // if (this.addForm.invalid) {
    //   this.addForm.markAllAsTouched();
    //   return;
    // }

    const selectedCompanyIds = this.addForm.get('compId')?.value || [];
    const selectedFinYearIds = this.addForm.get('finYearId')?.value || [];

    // if (this.addForm.invalid || selectedCompanyIds.length === 0 || selectedFinYearIds.length === 0) {
    //   this.addForm.markAllAsTouched();
    //   alert("Select at least 1 company & 1 financial year.");
    //   return;
    // }

    const now = new Date();

    const payload = {
      User_id: this.userId,
      Comp_id: selectedCompanyIds.join(','),
      Fin_year_id: selectedFinYearIds.join(','),
      Is_active: true,
      Created_date: now,
      Updated_date: null,
      Modified_by: this.currentUserId
    };

    console.log("ADD PAYLOAD:", payload);

    this.loginServices.addUserDetails(payload).subscribe({
      next: () => {
        alert("New mapping added successfully!");
        this.addForm.reset();
        this.loadMultipleUserDetails(this.userId);
      },
      error: (err) => {
        console.error(err);
        // alert("Failed to add mapping.");
        alert(err.error?.errorMessage || 'Failed to add mapping.');
      }
    });
  }
  
}
