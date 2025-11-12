import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileContactDetailComponent } from './student-profile-contact-detail.component';

describe('StudentProfileContactDetailComponent', () => {
  let component: StudentProfileContactDetailComponent;
  let fixture: ComponentFixture<StudentProfileContactDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfileContactDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
