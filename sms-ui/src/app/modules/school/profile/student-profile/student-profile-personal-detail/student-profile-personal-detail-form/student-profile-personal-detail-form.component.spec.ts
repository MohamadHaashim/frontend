import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfilePersonalDetailFormComponent } from './student-profile-personal-detail-form.component';

describe('StudentProfilePersonalDetailFormComponent', () => {
  let component: StudentProfilePersonalDetailFormComponent;
  let fixture: ComponentFixture<StudentProfilePersonalDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfilePersonalDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfilePersonalDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
