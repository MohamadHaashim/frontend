import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileOtherDetailComponent } from './student-profile-other-detail.component';

describe('StudentProfileOtherDetailComponent', () => {
  let component: StudentProfileOtherDetailComponent;
  let fixture: ComponentFixture<StudentProfileOtherDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentProfileOtherDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileOtherDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
