import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TimeEventService } from '../services/time-event.service';
import { TimeEvent } from '../model/time-event';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-time-event',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-event.component.html',
  styleUrl: './time-event.component.css',
})
export class TimeEventComponent {
  logForm!: FormGroup;
  events: any[] = [];
  columns: any[] = [];
  dialogFields: any[] = [];
  showModal: boolean = false;
  editIndex: number | null = null;
  isLoggedIn: boolean = false;
  username: any;
  activeTab: 'my' | 'all' = 'my';
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private timeEventService: TimeEventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load UI Configurations
    this.loadUIConfig();

    // Get the stored username and token from localStorage
    this.username = localStorage.getItem('username');
    const token = this.authService.getToken();

    if (token) {
      try {
        // Check if the token is valid
        if (this.authService.isTokenValid(token)) {
          // Token is valid, proceed to load events
          const roles = this.authService.getRolesFromToken(token);
          this.isAdmin = roles.includes('ROLE_ADMIN');

          if (roles.includes('ROLE_ADMIN')) {
            this.loadEvents(true); // Load all events for admin
            this.activeTab='all';
          } else {
            this.loadEvents(false); // Load only user events
          }
          this.editIndex = null; // Reset edit index
        } else {
          console.error('Token is invalid or expired.');
          this.authService.logout(); // Log out user
          alert('Session expired. Please log in again.');
        }
      } catch (e) {
        console.error('Error during event loading:', e);
        alert('An error occurred while loading events.');
      }
    } else {
      console.warn('No token found, please log in.');
      this.router.navigate(['/login']); // Redirect to login if no token
    }
  }

  switchTab(tab: 'my' | 'all') {
    this.activeTab = tab;
    this.loadEvents(tab === 'all');
  }

  loadEvents(isAllEvents: boolean = false): void {
    const eventObservable = isAllEvents
      ? this.timeEventService.getAllEvents()
      : this.timeEventService.getMyEvents();

    eventObservable.subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        alert('Failed to load events.');
      },
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

    const formValue = {
      ...this.logForm.value,
      username: this.username,
    };
    if (this.editIndex == null) {
      this.timeEventService.addTimeEvent(formValue).subscribe(() => {
        this.loadEvents();
        this.closeModal();
      });
    } else {
      this.timeEventService
        .updateTimeEvent(this.editIndex, formValue)
        .subscribe(() => {
          this.loadEvents();
          this.closeModal();
        });
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

      this.columns = config.columns;
      this.dialogFields = config.dialogFields;

      const controls: any = {};
      for (let field of this.dialogFields) {
        controls[field.field] = new FormControl(
          '',
          field.required ? Validators.required : null
        );
      }
      this.logForm = this.fb.group(controls);
    });
  }

  exportToCSV(data: any[], filename: string = 'data.csv') {
    if (!data || data.length === 0) return;

    // Get headers and exclude 'id' but keep 'user'
    const headers = Object.keys(data[0]).filter((key) => key !== 'id');
    if (headers.indexOf('user') === -1) {
      headers.push('user'); // Ensure 'user' header is present
    }


    const csvRows = [
      headers.join(','), // header row
      ...data.map((row) => {
        // Extract username from user object
        const rowWithUser = {
          ...row,
          user: row.user?.username || '', // Assuming `user` object has `username` field
        };

        return headers
          .map(
            (field) =>
              `"${(rowWithUser[field] ?? '').toString().replace(/"/g, '""')}"`
          )
          .join(',');
      }),
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
    this.authService.logout();
  }
}
