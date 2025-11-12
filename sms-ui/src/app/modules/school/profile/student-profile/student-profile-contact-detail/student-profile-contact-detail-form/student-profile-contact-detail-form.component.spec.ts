import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileContactDetailFormComponent } from './student-profile-contact-detail-form.component';

describe('StudentProfileContactDetailFormComponent', () => {
  let component: StudentProfileContactDetailFormComponent;
  let fixture: ComponentFixture<StudentProfileContactDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfileContactDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileContactDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
