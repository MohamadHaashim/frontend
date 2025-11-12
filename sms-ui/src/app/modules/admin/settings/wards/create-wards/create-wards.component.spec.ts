import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWardsComponent } from './create-wards.component';

describe('CreateWardsComponent', () => {
  let component: CreateWardsComponent;
  let fixture: ComponentFixture<CreateWardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
