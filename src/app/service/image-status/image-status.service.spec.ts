import { TestBed } from '@angular/core/testing';

import { ImageStatusService } from './image-status.service';

describe('ImageStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageStatusService = TestBed.get(ImageStatusService);
    expect(service).toBeTruthy();
  });
});
