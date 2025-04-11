import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeEventService } from '../services/time-event.service';
import { TimeEvent } from '../model/time-event';

@Component({
  selector: 'app-time-event',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-event.component basic.html',
  styleUrl: './time-event.component.css'
})
export class TimeEventComponentBasic implements OnInit {

  logForm!: FormGroup;
  logs: TimeEvent[] = [];

  constructor(private fb: FormBuilder, private timeEventService: TimeEventService) {}

  ngOnInit(): void {
    this.logForm = this.fb.group({
      logDate: ['', Validators.required],
      hoursLogged: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
    });

    this.fetchLogs();
  }

  fetchLogs(): void {
    this.timeEventService.getAllEvents().subscribe((data) => (this.logs = data));
    console.log('Data in logs:',this.logs)
  }

  onSubmit(): void {
    if (this.logForm.valid) {
      const newLog: TimeEvent = {
        ...this.logForm.value
      };
      this.timeEventService.addTimeEvent(newLog).subscribe((log) => {
        this.logs.push(log);
        this.logForm.reset();
      });
    }
  }

}
