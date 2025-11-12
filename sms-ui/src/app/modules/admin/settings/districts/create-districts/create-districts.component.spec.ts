import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDistrictsComponent } from './create-districts.component';

describe('CreateDistrictsComponent', () => {
  let component: CreateDistrictsComponent;
  let fixture: ComponentFixture<CreateDistrictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDistrictsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDistrictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
