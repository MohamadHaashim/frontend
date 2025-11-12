import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaluksComponent } from './create-taluks.component';

describe('CreateTaluksComponent', () => {
  let component: CreateTaluksComponent;
  let fixture: ComponentFixture<CreateTaluksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTaluksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTaluksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
