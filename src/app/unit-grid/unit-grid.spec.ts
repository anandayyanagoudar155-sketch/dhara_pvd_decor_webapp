import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitGrid } from './unit-grid';

describe('UnitGrid', () => {
  let component: UnitGrid;
  let fixture: ComponentFixture<UnitGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
