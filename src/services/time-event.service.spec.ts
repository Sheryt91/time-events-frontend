import { TestBed } from '@angular/core/testing';
import { TimeEventService } from './time-event.service';


describe('TimeEventService', () => {
  let service: TimeEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
