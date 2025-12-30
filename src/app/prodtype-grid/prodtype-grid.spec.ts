import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdtypeGrid } from './prodtype-grid';

describe('ProdtypeGrid', () => {
  let component: ProdtypeGrid;
  let fixture: ComponentFixture<ProdtypeGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdtypeGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdtypeGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
