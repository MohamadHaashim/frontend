import { TestBed } from '@angular/core/testing';

import { ServiceProvider } from './service.provider';

describe('ServiceProvider', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceProvider = TestBed.get(ServiceProvider);
    expect(service).toBeTruthy();
  });
});
