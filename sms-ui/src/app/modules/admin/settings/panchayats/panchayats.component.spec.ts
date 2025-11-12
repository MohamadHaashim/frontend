import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanchayatsComponent } from './panchayats.component';

describe('PanchayatsComponent', () => {
  let component: PanchayatsComponent;
  let fixture: ComponentFixture<PanchayatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanchayatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanchayatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
