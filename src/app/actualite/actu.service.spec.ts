import { TestBed } from '@angular/core/testing';

import { ActuService } from './actu.service';

describe('ActuService', () => {
  let service: ActuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
