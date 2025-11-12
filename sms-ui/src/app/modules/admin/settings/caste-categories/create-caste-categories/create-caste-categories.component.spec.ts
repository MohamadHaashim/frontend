import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCasteCategoriesComponent } from './create-caste-categories.component';

describe('CreateCasteCategoriesComponent', () => {
  let component: CreateCasteCategoriesComponent;
  let fixture: ComponentFixture<CreateCasteCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCasteCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCasteCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
