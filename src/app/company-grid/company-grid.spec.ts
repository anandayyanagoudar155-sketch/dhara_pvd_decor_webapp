import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGrid } from './company-grid';

describe('CompanyGrid', () => {
  let component: CompanyGrid;
  let fixture: ComponentFixture<CompanyGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
