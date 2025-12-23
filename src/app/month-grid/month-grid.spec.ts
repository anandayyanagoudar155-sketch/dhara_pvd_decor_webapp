import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthGrid } from './month-grid';

describe('MonthGrid', () => {
  let component: MonthGrid;
  let fixture: ComponentFixture<MonthGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
