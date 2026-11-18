import { TestBed } from '@angular/core/testing';

import { Userlist } from './userlist';

describe('Userlist', () => {
  let service: Userlist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Userlist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
