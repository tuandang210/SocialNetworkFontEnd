import { TestBed } from '@angular/core/testing';

import { AccountRelationService } from './account-relation.service';

describe('AccountRelationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountRelationService = TestBed.get(AccountRelationService);
    expect(service).toBeTruthy();
  });
});
