import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStudentComponent } from './map-student.component';

describe('MapStudentComponent', () => {
  let component: MapStudentComponent;
  let fixture: ComponentFixture<MapStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
