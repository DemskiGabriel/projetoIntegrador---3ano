import { TestBed } from '@angular/core/testing';

import { TimeChecker } from './time-checker';

describe('TimeChecker', () => {
  let service: TimeChecker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeChecker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
