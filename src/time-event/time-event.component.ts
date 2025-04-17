import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeEventService } from '../services/time-event.service';
import { TimeEvent } from '../model/time-event';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-time-event',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-event.component.html',
  styleUrl: './time-event.component.css'
})

export class TimeEventComponent {
  logForm!: FormGroup;
  events: any[] = [];
  columns: any[] = [];
  dialogFields: any[] = [];
  showModal: boolean = false;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder,
              private timeEventService: TimeEventService,
              private authService: AuthService,
              // private router: Router
              ) { }

  ngOnInit(): void {
    this.loadUIConfig();
    this.loadEvents();
    this.editIndex = null;
  }
  loadEvents(): void {
    this.timeEventService.getAllEvents().subscribe((data) => {
      this.events = data;
      console.log('Data in events:', this.events)

    });

  }

  openModal(event: any = null) {
    if (event) {
      this.editIndex = event.id;
      this.logForm.patchValue(event);
    } else {
      this.logForm.reset();
    }
    this.showModal = true;
  }

  onSubmit() {

    if (this.logForm.invalid) return;

    const formValue = this.logForm.value;

    if (this.editIndex == null) {
      this.timeEventService.addTimeEvent(formValue).subscribe(() => {
        this.loadEvents();
        this.closeModal();
      })
    } else {
      console.log('editIndex', this.editIndex)
      this.timeEventService.updateTimeEvent(this.editIndex, formValue).subscribe(() => {
        this.loadEvents();
        this.closeModal();
      })
    }

    this.editIndex = null;
    this.logForm.reset();
  }
  closeModal() {
    this.showModal = false;
  }

  delete(index: number) {
    if (confirm('Are you sure you want to delete this log?')) {
      this.timeEventService.deleteEvent(index).subscribe(() => {
        this.loadEvents();
      });
    }
  }

  loadUIConfig() {
    const userId = 'user123';
    const lang = 'eng';

    this.timeEventService.getConfig(userId, lang).subscribe((config: any) => {
      console.log('config:', config);

      this.columns = config.columns;
      this.dialogFields = config.dialogFields;

      const controls: any = {};
      for (let field of this.dialogFields) {
        controls[field.field] = new FormControl('', field.required ? Validators.required : null);
      }
      this.logForm = this.fb.group(controls);
    });
  }

  exportToCSV(data: any[], filename: string = 'data.csv') {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // header row
      ...data.map(row =>
        headers.map(field => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  logout() {
    // localStorage.removeItem("token");
    // this.router.navigate(["/login"]);
    this.authService.logout();
  }
}


