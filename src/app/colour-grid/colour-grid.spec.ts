import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourGrid } from './colour-grid';

describe('ColourGrid', () => {
  let component: ColourGrid;
  let fixture: ComponentFixture<ColourGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColourGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColourGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
