import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEventComponent } from './time-event.component';

describe('TimeEventComponent', () => {
  let component: TimeEventComponent;
  let fixture: ComponentFixture<TimeEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
