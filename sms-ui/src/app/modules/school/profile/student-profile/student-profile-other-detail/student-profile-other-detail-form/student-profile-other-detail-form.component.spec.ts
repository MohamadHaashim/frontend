import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileOtherDetailFormComponent } from './student-profile-other-detail-form.component';

describe('StudentProfileOtherDetailFormComponent', () => {
  let component: StudentProfileOtherDetailFormComponent;
  let fixture: ComponentFixture<StudentProfileOtherDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfileOtherDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileOtherDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
