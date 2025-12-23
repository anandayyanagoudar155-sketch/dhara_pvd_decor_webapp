import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServices } from '../services/login-services';
import { TwoDecimalValidator } from '../validators/two-decimal.validator';

@Component({
  selector: 'app-hsn-grid',
  standalone: false,
  templateUrl: './hsn-grid.html',
  styleUrl: './hsn-grid.css',
})
export class HsnGrid implements OnInit {

  gridApi!: GridApi;
  hsnList: any[] = [];
  addForm!: FormGroup;

  gstValueParser(params: any) {
    const value = params.newValue;

    if (value === null || value === '') {
      return params.oldValue;
    }

    if (!TwoDecimalValidator.isValid(value)) {
      return params.oldValue;
    }

    return Number(value);
  }

  columnDefs: ColDef[] = [
    { headerName: 'HSN ID', field: 'hsnId', flex: 1, minWidth: 100 },

    { headerName: 'HSN Code', field: 'hsnCode', editable: true, flex: 2 },

    {
      headerName: 'CGST %',
      field: 'cgst_perc',
      editable: true,
      flex: 1,
      valueParser: params => this.gstValueParser(params),
      onCellValueChanged: params => this.onCgstChanged(params)
    },

    {
      headerName: 'SGST %',
      field: 'sgst_perc',
      editable: true, 
      flex: 1,
      valueParser: params => this.gstValueParser(params)
    },

    {
      headerName: 'IGST %',
      field: 'igst_perc',
      editable: true, 
      flex: 1,
      valueParser: params => this.gstValueParser(params)
    },

    {
      headerName: 'Actions',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '6px';

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('btn', 'btn-edit');
        updateBtn.innerText = 'Update';
        updateBtn.onclick = () => this.updateHsn(params.data);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-delete');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => this.deleteHsn(params.data.hsnId);

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
    private hsnService: LoginServices,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadHsnList();

    // FORM 
    this.addForm = this.fb.group({
      hsnCode: ['', Validators.required],
      cgst: [0, [TwoDecimalValidator.nonNegative]],
      sgst: [0, [TwoDecimalValidator.nonNegative]],
      igst: [0, [TwoDecimalValidator.nonNegative]]
      // sgst: [{ value: 0 }],
      // igst: [{ value: 0 }]
    });

    // FORM AUTO GST
    this.addForm.get('cgst')?.valueChanges.subscribe(cgst => {
      if (TwoDecimalValidator.isValid(cgst)) {
        this.autoGenerateGstFromCgst(Number(cgst));
      }
    });
  }

  // FUNCTION AUTO GST
  autoGenerateGstFromCgst(cgst: number) {
    if (isNaN(cgst)) return;

    this.addForm.patchValue(
      {
        sgst: cgst,
        igst: cgst * 2
      },
      { emitEvent: false }
    );
  }

  // GRID AUTO GST 
  onCgstChanged(params: any) {
    const cgst = Number(params.newValue);
    if (isNaN(cgst)) return;

    params.data.sgst_perc = cgst;
    params.data.igst_perc = cgst * 2;

    this.gridApi.refreshCells({
      rowNodes: [params.node],
      columns: ['sgst_perc', 'igst_perc'],
      force: true
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('rowData', this.hsnList);
  }

  loadHsnList() {
    this.hsnService.getHsnList().subscribe({
      next: res => {
        this.hsnList = res;
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.hsnList);
        }
      },
      error: err => console.error(err)
    });
  }

  insertHsn() {
    if (this.addForm.invalid) {
      alert('HSN Code or GST value invalid');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);
    const formVal = this.addForm.getRawValue();

    const payload = {
      hsnCode: formVal.hsnCode,
      cgst_perc: formVal.cgst,
      sgst_perc: formVal.sgst,
      igst_perc: formVal.igst,
      created_date: new Date(),
      updated_date: new Date(),
      created_by: userobj.user_id,
      modified_by: userobj.user_id
    };

    this.hsnService.insertHsn(payload).subscribe({
      next: () => {
        alert('HSN added successfully');
        this.addForm.reset({ cgst: 0, sgst: 0, igst: 0 });
        this.loadHsnList();
      },
      error: err => alert(err.error?.errorMessage || 'Error occurred')
    });
  }

  updateHsn(row: any) {

    if (
      !TwoDecimalValidator.isValid(row.cgst_perc) ||
      !TwoDecimalValidator.isValid(row.sgst_perc) ||
      !TwoDecimalValidator.isValid(row.igst_perc)
    ) {
      alert('GST values must have max 2 decimal places');
      return;
    }

    const userobj = JSON.parse(sessionStorage.getItem('userobj')!);

    const payload = {
      hsnId: row.hsnId,
      hsnCode: row.hsnCode,
      cgst_perc: row.cgst_perc,
      sgst_perc: row.sgst_perc,
      igst_perc: row.igst_perc,
      created_date: row.created_date,
      updated_date: new Date(),
      created_by: row.created_by,
      modified_by: userobj.user_id
    };

    this.hsnService.updateHsn(payload).subscribe({
      next: () => {
        alert('HSN updated successfully');
        this.loadHsnList();
      },
      error: err => {
        alert(err.error?.errorMessage || 'Error occurred');
        this.loadHsnList();
      }
    });
  }

  deleteHsn(id: number) {
    if (!confirm('Are you sure?')) return;

    this.hsnService.deleteHsn(id).subscribe({
      next: () => {
        alert('HSN deleted successfully');
        this.loadHsnList();
      },
      error: err => alert(err.error?.errorMessage || 'Error occurred')
    });
  }
}
