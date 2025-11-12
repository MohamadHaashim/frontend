import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLanguagesComponent } from './create-languages.component';

describe('CreateLanguagesComponent', () => {
  let component: CreateLanguagesComponent;
  let fixture: ComponentFixture<CreateLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLanguagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
