import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmittedCategoryComponent } from './admitted-category.component';

describe('AdmittedCategoryComponent', () => {
  let component: AdmittedCategoryComponent;
  let fixture: ComponentFixture<AdmittedCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmittedCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmittedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
