import { TestBed } from '@angular/core/testing';

import { IvoryPresentableService } from './ivory-presentable.service';

describe('IvoryPresentationService', () => {
  let service: IvoryPresentableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IvoryPresentableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
