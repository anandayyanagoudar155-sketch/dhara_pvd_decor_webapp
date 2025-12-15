import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateGrid } from './state-grid';

describe('StateGrid', () => {
  let component: StateGrid;
  let fixture: ComponentFixture<StateGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
