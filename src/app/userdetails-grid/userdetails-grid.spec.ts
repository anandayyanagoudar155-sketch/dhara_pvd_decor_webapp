import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdetailsGrid } from './userdetails-grid';

describe('UserdetailsGrid', () => {
  let component: UserdetailsGrid;
  let fixture: ComponentFixture<UserdetailsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserdetailsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdetailsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
