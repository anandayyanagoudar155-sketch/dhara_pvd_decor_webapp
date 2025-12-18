import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandGrid } from './brand-grid';

describe('BrandGrid', () => {
  let component: BrandGrid;
  let fixture: ComponentFixture<BrandGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
