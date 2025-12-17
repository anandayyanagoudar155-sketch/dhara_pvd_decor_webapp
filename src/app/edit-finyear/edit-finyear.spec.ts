import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinyear } from './edit-finyear';

describe('EditFinyear', () => {
  let component: EditFinyear;
  let fixture: ComponentFixture<EditFinyear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFinyear]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFinyear);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
