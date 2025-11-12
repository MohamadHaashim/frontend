import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdmittedCategoryComponent } from './create-admitted-category.component';

describe('CreateAdmittedCategoryComponent', () => {
  let component: CreateAdmittedCategoryComponent;
  let fixture: ComponentFixture<CreateAdmittedCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAdmittedCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAdmittedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
