import { TestBed } from '@angular/core/testing';

import { VideoServiceService } from './video-service.service';

describe('VideoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoServiceService = TestBed.get(VideoServiceService);
    expect(service).toBeTruthy();
  });
});
