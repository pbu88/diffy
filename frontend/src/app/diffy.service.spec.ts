import { HttpClientModule } from '@angular/common/http';
import {TestBed} from '@angular/core/testing';

import {DiffyService} from './diffy.service';

describe('DiffyService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientModule],
  }));

  it('should be created', () => {
    const service: DiffyService = TestBed.get(DiffyService);
    expect(service).toBeTruthy();
  });
});
