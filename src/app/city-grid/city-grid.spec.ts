import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityGrid } from './city-grid';

describe('CityGrid', () => {
  let component: CityGrid;
  let fixture: ComponentFixture<CityGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CityGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
