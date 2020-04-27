import { TestBed } from '@angular/core/testing';

import { GetPopulationServiceService } from './get-population-service.service';

describe('GetPopulationServiceService', () => {
  let service: GetPopulationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPopulationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
