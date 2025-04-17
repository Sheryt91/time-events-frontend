import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginFields: any[] = [];
  loginForm!: FormGroup;


  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.loadLoginConfig();

  }
  loadLoginConfig() {
    const userId = 'user123';
    const lang = 'eng';

    this.commonService.getConfig(userId, lang).subscribe((config: any) => {

      this.loginFields = config.loginFields;
      console.log('login config:', this.loginFields);

      const controls: any = {};
      for (let field of this.loginFields) {
        controls[field.field] = new FormControl('', field.required ? Validators.required : []);
      }
      this.loginForm = this.fb.group(controls);
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // localStorage.setItem('token', res.token);
          this.authService.saveToken(res.token);
          this.router.navigate(["/time-events"]);
        },
        error: (err) => {
          alert('Login Failed');
          console.error('Login error:', err);
        }
      });
      //this.router.navigate(["/time-events"]);

    }
  }
}