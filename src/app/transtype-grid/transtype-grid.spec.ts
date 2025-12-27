import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranstypeGrid } from './transtype-grid';

describe('TranstypeGrid', () => {
  let component: TranstypeGrid;
  let fixture: ComponentFixture<TranstypeGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranstypeGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranstypeGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
