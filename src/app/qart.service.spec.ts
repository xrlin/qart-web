import { TestBed, inject } from '@angular/core/testing';

import { QartService } from './qart.service';

describe('QartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QartService]
    });
  });

  it('should be created', inject([QartService], (service: QartService) => {
    expect(service).toBeTruthy();
  }));
});
