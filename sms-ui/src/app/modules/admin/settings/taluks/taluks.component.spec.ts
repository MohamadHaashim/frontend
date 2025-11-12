import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaluksComponent } from './taluks.component';

describe('TaluksComponent', () => {
  let component: TaluksComponent;
  let fixture: ComponentFixture<TaluksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaluksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaluksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
