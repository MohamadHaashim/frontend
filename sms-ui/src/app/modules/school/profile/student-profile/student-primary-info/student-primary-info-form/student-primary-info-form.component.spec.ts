import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPrimaryInfoFormComponent } from './student-primary-info-form.component';

describe('StudentPrimaryInfoFormComponent', () => {
  let component: StudentPrimaryInfoFormComponent;
  let fixture: ComponentFixture<StudentPrimaryInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPrimaryInfoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPrimaryInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
