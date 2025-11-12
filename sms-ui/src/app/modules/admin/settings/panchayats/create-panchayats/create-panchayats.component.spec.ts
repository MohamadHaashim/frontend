import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePanchayatsComponent } from './create-panchayats.component';

describe('CreatePanchayatsComponent', () => {
  let component: CreatePanchayatsComponent;
  let fixture: ComponentFixture<CreatePanchayatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePanchayatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePanchayatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
