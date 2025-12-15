import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserdetails } from './add-userdetails';

describe('AddUserdetails', () => {
  let component: AddUserdetails;
  let fixture: ComponentFixture<AddUserdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
