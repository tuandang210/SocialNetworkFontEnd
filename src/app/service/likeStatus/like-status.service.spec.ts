import { TestBed } from '@angular/core/testing';

import { LikeStatusService } from './like-status.service';

describe('LikeStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LikeStatusService = TestBed.get(LikeStatusService);
    expect(service).toBeTruthy();
  });
});
