import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReligionsComponent } from './create-religions.component';

describe('CreateReligionsComponent', () => {
  let component: CreateReligionsComponent;
  let fixture: ComponentFixture<CreateReligionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateReligionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateReligionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
