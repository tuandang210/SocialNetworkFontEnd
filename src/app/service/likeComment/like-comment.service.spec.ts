import { TestBed } from '@angular/core/testing';

import { LikeCommentService } from './like-comment.service';

describe('LikeCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LikeCommentService = TestBed.get(LikeCommentService);
    expect(service).toBeTruthy();
  });
});
