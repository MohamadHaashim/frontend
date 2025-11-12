import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryDetailsComponent } from './primary-details.component';

describe('PrimaryDetailsComponent', () => {
  let component: PrimaryDetailsComponent;
  let fixture: ComponentFixture<PrimaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
