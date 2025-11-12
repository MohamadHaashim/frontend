import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCulturalsComponent } from './create-culturals.component';

describe('CreateCulturalsComponent', () => {
  let component: CreateCulturalsComponent;
  let fixture: ComponentFixture<CreateCulturalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCulturalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCulturalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
