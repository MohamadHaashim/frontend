import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStatesComponent } from './create-states.component';

describe('CreateStatesComponent', () => {
  let component: CreateStatesComponent;
  let fixture: ComponentFixture<CreateStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateStatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
