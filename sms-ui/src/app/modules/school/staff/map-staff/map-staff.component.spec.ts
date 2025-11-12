import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStaffComponent } from './map-staff.component';

describe('MapStaffComponent', () => {
  let component: MapStaffComponent;
  let fixture: ComponentFixture<MapStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
