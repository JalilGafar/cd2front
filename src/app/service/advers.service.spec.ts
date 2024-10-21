import { TestBed } from '@angular/core/testing';

import { AdversService } from './advers.service';

describe('AdversService', () => {
  let service: AdversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
