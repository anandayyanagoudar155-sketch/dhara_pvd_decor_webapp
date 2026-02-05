import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import {
  LoginServices,
  Customer_List
} from '../services/login-services';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-customer-grid',
  standalone: false,
  templateUrl: './customer-grid.html',
  styleUrl: './customer-grid.css',
})
export class CustomerGrid implements OnInit {

  gridApi!: GridApi;
  customerList: Customer_List[] = [];

  logoPreview: string = ""; 
  companyName: string = "";

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
    this.loadCompanyLogo();
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


// loadCompanyLogo() {

//   const user = JSON.parse(sessionStorage.getItem('userobj')!);
//   const compId = user.comp_id;   
//   this.companyName = user.comp_name;

//   this.customerService.getCompanyLogo(compId).subscribe({
//     next: (res) => {
//       if (res.logoBase64) {
//         this.logoPreview = "data:image/jpeg;base64," + res.logoBase64;
//       }
//     },
//     error: (err) => console.log("Logo load error", err)
//   });
// }

loadCompanyLogo() {

  const user = JSON.parse(sessionStorage.getItem('userobj')!);
  const compId = user.comp_id;
  this.companyName = user.comp_name;

  this.customerService.getCompanyLogo(compId).subscribe({
    next: (res) => {
      console.log(res.logoBase64)

      if (res.logoBase64) {
        const cleanBase64 = res.logoBase64.replace(/\s/g, '');
        this.logoPreview = "data:image/jpeg;base64," + cleanBase64;
      }
    },
    error: (err) => console.log("Logo load error", err)
  });
}

// exportToPdf() {
//   if (!this.customerList || this.customerList.length === 0) {
//     alert('No data to export');
//     return;
//   }
//   if (!this.logoPreview) {
//     alert("Logo still loading... Please try again.");
//     return;
//   }

//    const doc = new jsPDF("l", "mm", "a4");

//     let startY = 20;

//   //  Add Logo (Left Side)
//   if (this.logoPreview) {
//     doc.addImage(
//       this.logoPreview,
//       "JPEG",
//       10,   // X
//       5,    // Y
//       25,   // Width
//       25    // Height
//     );
//   }

//   //  Add Company Name (Next to Logo)
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.text(this.companyName || "Company Name", 40, 18);

//   //  Subtitle (Optional)
//   doc.setFontSize(11);
//   doc.setFont("helvetica", "normal");
//   doc.text("Customer Master Report", 40, 25);

//   //  Line Separator
//   doc.setLineWidth(0.5);
//   doc.line(10, 32, 285, 32);

//   // Table will start after header
//   startY = 40;

//   doc.text('Customer Master', 14, 10);

//   const columns = [
//     'Customer ID',
//     'Customer Name',
//     'Prefix',
//     'Gender',
//     'Phone Number',
//     'City ID',
//     'City',
//     'Address',
//     'Email',
//     'DOB',
//     'Aadhaar No',
//     'License No',
//     'PAN No',
//     'GST No',
//     'Created Date',
//     'Created By',
//     'Updated Date',
//     'Updated By',
//     'Notes'
//   ];

// const rows = (this.customerList as any[]).map(c => [
//   c.customer_Id,
//   c.customer_Name,
//   c.prefix,
//   c.gender,
//   c.phonenumber,
//   c.city_Id,
//   c.city_Name,
//   c.cust_Address,
//   c.email_Id,
//   c.dob,
//   c.aadhaar_Number,
//   c.license_Number,
//   c.pan_Number,
//   c.gst_Number,
//   c.created_Date,
//   c.created_by,
//   c.updated_Date,
//   c.modified_by,
//   c.customer_Notes
// ]);

//   autoTable(doc, {
//     head: [columns],
//     body: rows,
//     startY: startY,
//     styles: { fontSize: 8 },
//     headStyles: { fillColor: [22, 160, 133] }
//   });

//   doc.save('customers.pdf');
// }
//---------------------------------------------
// exportToPdf() {

//   if (!this.customerList || this.customerList.length === 0) {
//     alert("No data to export");
//     return;
//   }

//   if (!this.logoPreview) {
//     alert("No Logo");
//     return;
//   }

//   const doc = new jsPDF("l", "mm", "a3");

//   let startY = 40;

//   doc.addImage(
//     this.logoPreview,
//     "JPEG",   // Must match JPG
//     10,       // X Position
//     8,        // Y Position
//     22,       // Width
//     22        // Height
//   );


//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.text(this.companyName || "Company Name", 40, 16);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);
//   doc.text("Customer Master Report", 40, 24);

//   doc.setLineWidth(0.5);
//   doc.line(10, 32, 410, 32);


//   const columns = [
//     "Customer ID",
//     "Customer Name",
//     "Prefix",
//     "Gender",
//     "Phone Number",
//     "City ID",
//     "City",
//     "Address",
//     "Email",
//     "DOB",
//     "Aadhaar No",
//     "License No",
//     "PAN No",
//     "GST No",
//     "Created Date",
//     "Created By",
//     "Updated Date",
//     "Updated By",
//     "Notes"
//   ];


//   const rows = (this.customerList as any[]).map(c => [
//     c.customer_Id,
//     c.customer_Name,
//     c.prefix,
//     c.gender,
//     c.phonenumber,
//     c.city_Id,
//     c.city_Name,
//     c.cust_Address,
//     c.email_Id,
//     c.dob,
//     c.aadhaar_Number,
//     c.license_Number,
//     c.pan_Number,
//     c.gst_Number,
//     c.created_Date,
//     c.created_by,
//     c.updated_Date,
//     c.modified_by,
//     c.customer_Notes
//   ]);


//   autoTable(doc, {
//     head: [columns],
//     body: rows,
//     startY: startY,
//     styles: { fontSize: 8 },
//     headStyles: { fillColor: [22, 160, 133] }
//   });

//   doc.save("customers.pdf");
// }

exportToPdf() {

  if (!this.customerList || this.customerList.length === 0) {
    alert("No data to export");
    return;
  }

  if (!this.logoPreview) {
    alert("No Logo");
    return;
  }

  //  A4 Landscape PDF
  const doc = new jsPDF("l", "mm", "a4");

  //  Page Size
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Banner Height
  const headerHeight = 35;

  //  Page Padding for Banner
  const marginX = 10;   // Left + Right Space
  const marginTop = 5;  // Top Space

  //  Banner Width inside margins
  const bannerWidth = pageWidth - marginX * 2;

  //  Columns
  const columns = [
    "Customer ID",
    "Customer Name",
    "Prefix",
    "Gender",
    "Phone Number",
    "City",
    "Address",
    "Email",
    "DOB",
    "Aadhaar No",
    "License No",
    "PAN No",
    "GST No",
    "Notes"
  ];

  //  Rows
  const rows = (this.customerList as any[]).map(c => [
    c.customer_Id,
    c.customer_Name,
    c.prefix,
    c.gender,
    c.phonenumber,
    c.city_Name,
    c.cust_Address,
    c.email_Id,
    c.dob,
    c.aadhaar_Number,
    c.license_Number,
    c.pan_Number,
    c.gst_Number,
    c.customer_Notes
  ]);

  //  AutoTable Export
  autoTable(doc, {
    head: [columns],
    body: rows,

    //  Table starts after header
    startY: headerHeight + marginTop + 8,

    tableWidth: "auto",

    styles: {
      fontSize: 6,
      cellPadding: 1.5,
      overflow: "linebreak"
    },

    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontSize: 6
    },

    horizontalPageBreak: true,

    //  Header + Footer on Every Page
    didDrawPage: () => {

      //  Banner Header
      doc.addImage(
        this.logoPreview,
        "JPEG",
        marginX,
        marginTop,
        bannerWidth,
        headerHeight
      );

      //  Line below header
      doc.setLineWidth(0.5);
      doc.line(
        marginX,
        headerHeight + marginTop + 2,
        pageWidth - marginX,
        headerHeight + marginTop + 2
      );

      //  Page Number Footer
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      const totalPages = doc.getNumberOfPages(); 

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - marginX,
        pageHeight - 8,
        { align: "right" }
      );
    }
  });

  //  Save PDF
  doc.save("customers.pdf");
}

exportToExcel() {
  if (!this.customerList || this.customerList.length === 0) {
    alert('No data to export');
    return;
  }

const data = (this.customerList as any[]).map(c => ({
  'Customer ID': c.customer_Id,
  'Customer Name': c.customer_Name,
  'Prefix': c.prefix,
  'Gender': c.gender,
  'Phone Number': c.phonenumber,
  'City ID':c.city_Id,
  'City': c.city_Name,
  'Address': c.cust_Address,
  'Email': c.email_Id,
  'DOB': c.dob,
  'Aadhaar No': c.aadhaar_Number,
  'License No': c.license_Number,
  'PAN No': c.pan_Number,
  'GST No': c.gst_Number,
  'Created Date':c.created_Date,
  'Created By':c.created_by,
  'Updated Date':c.updated_Date,
  'Updated By':c.modified_by,
  'Notes': c.customer_Notes
}));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = {
    Sheets: { Customers: worksheet },
    SheetNames: ['Customers']
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob(
    [excelBuffer],
    { type: 'application/octet-stream' }
  );

  saveAs(blob, 'customers.xlsx');
}

exportToCsv() {
  if (!this.customerList || this.customerList.length === 0) {
    alert('No data to export');
    return;
  }

  const data = (this.customerList as any[]).map(c => ({
    'Customer ID': c.customer_Id,
    'Customer Name': c.customer_Name,
    'Prefix': c.prefix,
    'Gender': c.gender,
    'Phone Number': c.phonenumber,
    'City ID':c.city_Id,
    'City': c.city_Name,
    'Address': c.cust_Address,
    'Email': c.email_Id,
    'DOB': c.dob,
    'Aadhaar No': c.aadhaar_Number,
    'License No': c.license_Number,
    'PAN No': c.pan_Number,
    'GST No': c.gst_Number,
    'Created Date':c.created_Date,
    'Created By':c.created_by,
    'Updated Date':c.updated_Date,
    'Updated By':c.modified_by,
    'Notes': c.customer_Notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'customers.csv';
  link.click();
}

importFromExcel(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const excelData: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (!excelData.length) {
      alert('Excel is empty');
      return;
    }

    this.processImportedCustomers(excelData);
  };

  reader.readAsBinaryString(file);
}

 excelDateToString(excelDate: any): string | null {
    if (!excelDate) return null;

    if (typeof excelDate === 'string') {
      return excelDate;
    }

    const utcDays = Math.floor(excelDate - 25569);
    const utcValue = utcDays * 86400;
    const date = new Date(utcValue * 1000);

    return date.toISOString().split('T')[0];
  }

processImportedCustomers(excelData: any[]) {
  const existingPhones = new Set(
    this.customerList.map((c: any) => c.phonenumber?.toString().trim())
  );

  const existingEmails = new Set(
    this.customerList.map((c: any) => c.email_Id?.toLowerCase().trim())
  );

  const newCustomers = excelData.filter(row =>
    !existingPhones.has(row['Phone Number']?.toString().trim()) &&
    !existingEmails.has(row['Email']?.toLowerCase().trim())
  );

  if (!newCustomers.length) {
    alert('All records already exist. Nothing to import.');
    return;
  }

  this.saveImportedCustomers(newCustomers);
}

saveImportedCustomers(customers: any[]) {
  const requests = customers.map(c => {
    const payload = {
      customer_Name: c['Customer Name'],
      prefix: c['Prefix'],
      gender: c['Gender'],
      phonenumber: c['Phone Number']?.toString(),
      cust_Address: c['Address'],
      email_Id: c['Email'],
      dob: this.excelDateToString(c['DOB']),
      aadhaar_Number: c['Aadhaar No']?.toString(),
      license_Number: c['License No']?.toString(),
      pan_Number: c['PAN No']?.toString(),
      gst_Number: c['GST No']?.toString(),
      city_Id: Number(c['City ID']),
      Created_by: Number(c['Created By']),
      Created_date: this.excelDateToString(c['Created Date']),
      Modified_by: Number(c['Updated By']),
      Updated_date: this.excelDateToString(c['Updated Date']),
      customer_Notes: c['Notes']
    };

    return this.customerService.insertCustomer(payload);
  });

  forkJoin(requests).subscribe({
    next: res => {
      alert(`${res.length} customers imported successfully`);
      this.loadCustomerList();
    },
    error: err => {
      console.error(err);
      alert('Some records failed to import');
    }
  });

}


  
}
