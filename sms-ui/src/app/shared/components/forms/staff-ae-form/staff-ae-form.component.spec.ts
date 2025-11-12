import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAeFormComponent } from './staff-ae-form.component';

describe('StaffAeFormComponent', () => {
  let component: StaffAeFormComponent;
  let fixture: ComponentFixture<StaffAeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffAeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
