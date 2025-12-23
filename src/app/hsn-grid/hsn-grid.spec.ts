import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnGrid } from './hsn-grid';

describe('HsnGrid', () => {
  let component: HsnGrid;
  let fixture: ComponentFixture<HsnGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HsnGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
