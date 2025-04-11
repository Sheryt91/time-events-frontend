import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeEventService } from '../services/time-event.service';
import { TimeEvent } from '../model/time-event';

declare var bootstrap: any;

@Component({
  selector: 'app-time-event',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-event.component copy.html',
  styleUrl: './time-event.component.css'
})

export class TimeEventComponentCopy  {
  // logForm!: FormGroup;
  // logs: TimeEvent[] = [];

  // constructor(private fb: FormBuilder, private timeEventService: TimeEventService) {}

  // ngOnInit(): void {
  //   this.logForm = this.fb.group({
  //     logDate: ['', Validators.required],
  //     hoursLogged: [0, [Validators.required, Validators.min(1)]],
  //     description: ['', Validators.required],
  //   });

  //   this.fetchLogs();
  // }

  // fetchLogs(): void {
  //   this.timeEventService.getAllEvents().subscribe((data) => (this.logs = data));
  //   console.log('Data in logs:',this.logs)
  // }

  // onSubmit(): void {
  //   if (this.logForm.valid) {
  //     const newLog: TimeEvent = {
  //       ...this.logForm.value
  //     };
  //     this.timeEventService.addTimeEvent(newLog).subscribe((log) => {
  //       this.logs.push(log);
  //       this.logForm.reset();
  //     });
  //   }
  // }

  logForm: FormGroup;
  logs: any[] = [];
  editIndex: number | null = null;
  modal: any;
  @ViewChild('logModal') logModalRef!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.logForm = this.fb.group({
      logDate: ['', Validators.required],
      hoursLogged: [1, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
    });
  }


  ngAfterViewInit() {
    if(this.logModalRef)
    this.modal = new bootstrap.Modal(this.logModalRef.nativeElement);
  }

  openModal(log: any = null, index: number | null = null) {
    console.log('I am inside openModal')
    this.editIndex = index;
    if (log) {
      this.logForm.patchValue(log);
    } else {
      this.logForm.reset();
    }
    this.modal?.show();
  }

  onSubmit() {
    const formValue = this.logForm.value;
    if (this.editIndex !== null) {
      this.logs[this.editIndex] = formValue;
    } else {
      this.logs.push(formValue);
    }
    this.modal.hide();
    this.editIndex = null;
    this.logForm.reset();
  }

  deleteLog(index: number) {
    if (confirm('Are you sure you want to delete this log?')) {
      this.logs.splice(index, 1);
    }
  }
}
