import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasteCategoriesComponent } from './caste-categories.component';

describe('ListCasteCategoriesComponent', () => {
  let component: CasteCategoriesComponent;
  let fixture: ComponentFixture<CasteCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasteCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasteCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
