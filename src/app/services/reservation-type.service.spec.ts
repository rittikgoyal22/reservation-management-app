import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReservationTypeService } from './reservation-type.service';

describe('ReservationTypeService', () => {
  let service: ReservationTypeService;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ReservationTypeService);
  });
  it('should be created', () => { expect(service).toBeTruthy(); });
});
