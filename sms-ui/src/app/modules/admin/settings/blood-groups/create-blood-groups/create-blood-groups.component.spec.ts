import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBloodGroupsComponent } from './create-blood-groups.component';

describe('CreateBloodGroupsComponent', () => {
  let component: CreateBloodGroupsComponent;
  let fixture: ComponentFixture<CreateBloodGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBloodGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBloodGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
