import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytypeGrid } from './paytype-grid';

describe('PaytypeGrid', () => {
  let component: PaytypeGrid;
  let fixture: ComponentFixture<PaytypeGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaytypeGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytypeGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
