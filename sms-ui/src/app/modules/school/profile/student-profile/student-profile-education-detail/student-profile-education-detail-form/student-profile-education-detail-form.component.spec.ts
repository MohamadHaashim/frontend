import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileEducationDetailFormComponent } from './student-profile-education-detail-form.component';

describe('StudentProfileEducationDetailFormComponent', () => {
  let component: StudentProfileEducationDetailFormComponent;
  let fixture: ComponentFixture<StudentProfileEducationDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfileEducationDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileEducationDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
