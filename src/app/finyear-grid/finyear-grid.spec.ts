import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinyearGrid } from './finyear-grid';

describe('FinyearGrid', () => {
  let component: FinyearGrid;
  let fixture: ComponentFixture<FinyearGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinyearGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinyearGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
