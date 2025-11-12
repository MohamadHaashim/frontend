import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSportsComponent } from './create-sports.component';

describe('CreateSportsComponent', () => {
  let component: CreateSportsComponent;
  let fixture: ComponentFixture<CreateSportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
