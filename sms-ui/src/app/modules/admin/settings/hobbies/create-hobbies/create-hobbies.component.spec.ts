import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHobbiesComponent } from './create-hobbies.component';

describe('CreateHobbiesComponent', () => {
  let component: CreateHobbiesComponent;
  let fixture: ComponentFixture<CreateHobbiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateHobbiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateHobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
