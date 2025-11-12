import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAeFormComponent } from './student-ae-form.component';

describe('StudentAeFormComponent', () => {
  let component: StudentAeFormComponent;
  let fixture: ComponentFixture<StudentAeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentAeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
