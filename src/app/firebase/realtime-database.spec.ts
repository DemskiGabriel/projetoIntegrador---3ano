import { TestBed } from '@angular/core/testing';

import { RealtimeDatabase } from './realtime-database';

describe('RealtimeDatabase', () => {
  let service: RealtimeDatabase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeDatabase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
