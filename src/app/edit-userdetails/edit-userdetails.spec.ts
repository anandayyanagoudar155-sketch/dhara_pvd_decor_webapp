import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserdetails } from './edit-userdetails';

describe('EditUserdetails', () => {
  let component: EditUserdetails;
  let fixture: ComponentFixture<EditUserdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
