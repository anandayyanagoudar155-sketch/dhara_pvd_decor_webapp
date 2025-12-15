import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryGrid } from './country-grid';

describe('CountryGrid', () => {
  let component: CountryGrid;
  let fixture: ComponentFixture<CountryGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
