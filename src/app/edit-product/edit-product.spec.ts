import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProduct } from './edit-product';

describe('EditProduct', () => {
  let component: EditProduct;
  let fixture: ComponentFixture<EditProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
