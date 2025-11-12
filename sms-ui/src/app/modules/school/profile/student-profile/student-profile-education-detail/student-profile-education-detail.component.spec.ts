import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileEducationDetailComponent } from './student-profile-education-detail.component';

describe('StudentProfileEducationDetailComponent', () => {
  let component: StudentProfileEducationDetailComponent;
  let fixture: ComponentFixture<StudentProfileEducationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfileEducationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileEducationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
