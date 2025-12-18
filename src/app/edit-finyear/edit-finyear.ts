import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServices,SingleFinYear } from '../services/login-services';

@Component({
  selector: 'app-edit-finyear',
  standalone: false,
  templateUrl: './edit-finyear.html',
  styleUrl: './edit-finyear.css',
})
export class EditFinyear implements OnInit {

  finYearForm!: FormGroup;

  isEditMode = false;
  finYearId: number | null = null;

  createdBy!: number;
  createdDate!: Date;

  constructor(
    private fb: FormBuilder,
    private svc: LoginServices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.finYearForm.get('fin_name')!
    .valueChanges
    .subscribe(value => {
      if (!this.isEditMode) {
        this.autoGenerateFinYear(value);
      }
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && id > 0) {
      this.isEditMode = true;
      this.finYearId = id;
      this.loadFinYearForEdit(id);
    }
  }

  initializeForm() {
    this.finYearForm = this.fb.group({
   fin_name: ['',
      [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{4}$/)
      ]
    ],
      short_fin_year: ['', Validators.required],
      year_start: ['', Validators.required],
      year_end: ['', Validators.required]
    });
  }

// private formatDate(date: Date): string {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

// private dateOnly(d: Date): Date {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate());
// }


formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

autoGenerateFinYear(finName: string) {
  if (!finName) return;

  // Expecting format: 2026-2027
  const match = finName.match(/^(\d{4})-(\d{4})$/);
  if (!match) return;

  const startYear = Number(match[1]);
  const endYear = startYear + 1;

  console.log(startYear)
  console.log(endYear)

  const shortFinYear = startYear.toString().slice(2) + '-' + endYear.toString().slice(2);

  const yearStart = new Date(startYear, 3, 1);  // 01-Apr
  const yearEnd = new Date(endYear, 2, 31);     // 31-Mar

  console.log(yearStart)
  console.log(yearEnd)

  this.finYearForm.patchValue(
    {
      fin_name: `${startYear}-${endYear}`, 
      short_fin_year: shortFinYear,
      year_start: yearStart,
      year_end: yearEnd
    },
    { emitEvent: false }
  );
}

  loadFinYearForEdit(finYearId: number) {
    this.svc.getFinYearById(finYearId).subscribe({
      next: (res: SingleFinYear) => {
        this.createdBy = res.created_by;
        this.createdDate = res.created_date;

        this.finYearForm.patchValue({
          fin_name: res.fin_name,
          short_fin_year: res.short_fin_year,
          year_start: new Date(res.year_start),
          year_end: new Date(res.year_end)
          // year_start: new Date(res.year_start),
          // year_end: new Date(res.year_end)
        });
      },
      error: err => {
        console.error(err);
        alert('Failed to load Financial Year');
      }
    });
  }

  submitFinYear() {
    if (this.finYearForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      // ...this.finYearForm.value,
      // created_by: user.user_id,
      // created_date: new Date(),
      // modified_by: user.user_id,
      // updated_date: new Date()

        fin_name: this.finYearForm.value.fin_name,
        short_fin_year: this.finYearForm.value.short_fin_year,
        year_start: this.formatYMD(this.finYearForm.value.year_start),
        year_end: this.formatYMD(this.finYearForm.value.year_end),
        created_by: user.user_id,
        created_date: new Date(),
        modified_by: user.user_id,
        updated_date: new Date()

    };


    console.log('FinYear payload:', payload);

    this.svc.insertFinYear(payload).subscribe({
      next: () => {
        alert('Financial Year added successfully');
        this.router.navigate(['/finyearlist']);
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Insert failed');
      }
    });
  }

  updateFinYear() {
    if (this.finYearForm.invalid || !this.finYearId) {
      alert('Please fill all required fields');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      // fin_year_id: this.finYearId,
      // ...this.finYearForm.value,
      // created_by: this.createdBy,
      // created_date: this.createdDate,
      // modified_by: user.user_id,
      // updated_date: new Date()

        fin_year_id: this.finYearId,
        fin_name: this.finYearForm.value.fin_name,
        short_fin_year: this.finYearForm.value.short_fin_year,
        year_start: this.formatYMD(this.finYearForm.value.year_start),
        year_end: this.formatYMD(this.finYearForm.value.year_end),
        created_by: this.createdBy,
        created_date: this.createdDate,
        modified_by: user.user_id,
        updated_date: new Date()
    };

    this.svc.updateFinYear(payload).subscribe({
      next: () => {
        alert('Financial Year updated successfully');
        this.router.navigate(['/finyearlist']);
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Update failed');
      }
    });
  }

  resetForm() {
    this.finYearForm.reset();
    this.isEditMode = false;
    this.finYearId = null;
  }
}
