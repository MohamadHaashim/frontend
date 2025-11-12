import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPrimaryInfoComponent } from './student-primary-info.component';

describe('StudentPrimaryInfoComponent', () => {
  let component: StudentPrimaryInfoComponent;
  let fixture: ComponentFixture<StudentPrimaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPrimaryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPrimaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
