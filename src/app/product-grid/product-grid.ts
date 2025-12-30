import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import { LoginServices,ProductList } from '../services/login-services';

@Component({
  selector: 'app-product-grid',
  standalone: false,
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css',
})
export class ProductGrid implements OnInit {

  gridApi!: GridApi;
  productList: ProductList[] = [];

  constructor(
    private productService: LoginServices,
    private router: Router
  ) {}

  columnDefs: ColDef[] = [
    { headerName: 'Product ID', field: 'product_Id', minWidth: 110 },

    { headerName: 'Product Name', field: 'product_name', minWidth: 220 },
    { headerName: 'Description', field: 'product_desc', minWidth: 250 },

    { headerName: 'Product Type', field: 'prodtype_name', minWidth: 180 },
    { headerName: 'Brand', field: 'brand_name', minWidth: 160 },
    { headerName: 'HSN', field: 'hsn_name', minWidth: 140 },
    { headerName: 'Unit', field: 'unit_name', minWidth: 120 },

    { headerName: 'Rate', field: 'rate', minWidth: 120 },

    // { headerName: 'Created Date', field: 'created_Date', minWidth: 140 },
    // { headerName: 'Updated Date', field: 'updated_Date', minWidth: 140 },

    // { headerName: 'Created By', field: 'created_by_name', minWidth: 160 },
    // { headerName: 'Modified By', field: 'modified_by_name', minWidth: 160 },

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
          this.prepareForEdit(params.data.product_Id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () =>
          this.deleteProduct(params.data.product_Id);

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
    this.loadProductList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    if (this.productList.length) {
      this.gridApi.setGridOption('rowData', this.productList);
    }
  }

  loadProductList() {
    this.productService.getProductList().subscribe({
      next: res => {
        this.productList = res || [];
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.productList);
        }
      },
      error: err => console.error(err)
    });
  }

  prepareForEdit(productId: number) {
    this.router.navigate(['/product/edit', productId]);
  }

  deleteProduct(productId: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Product deleted successfully');
        this.loadProductList();
      },
      error: err => {
        console.error(err);
        alert(err?.error?.errorMessage || 'Delete failed');
      }
    });
  }
}