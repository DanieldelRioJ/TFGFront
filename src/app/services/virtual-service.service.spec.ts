import { TestBed } from '@angular/core/testing';

import { VirtualServiceService } from './virtual-service.service';

describe('VirtualServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtualServiceService = TestBed.get(VirtualServiceService);
    expect(service).toBeTruthy();
  });
});
