import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfilePersonalDetailComponent } from './student-profile-personal-detail.component';

describe('StudentProfilePersonalDetailComponent', () => {
  let component: StudentProfilePersonalDetailComponent;
  let fixture: ComponentFixture<StudentProfilePersonalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfilePersonalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfilePersonalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
