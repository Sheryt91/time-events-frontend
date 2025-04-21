import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports:[CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
    this.authService.isLoggedIn().subscribe((status:boolean)=>{
      this.isLoggedIn=status;
    });

    this.authService.username$.subscribe((username: string | null)=>{
      this.username=username;
    })
     // If username exists in localStorage, set it directly
     const storedUsername = localStorage.getItem('username');
     if (storedUsername) {
       this.username = storedUsername;
       this.isLoggedIn = true; // Assuming user is logged in if username is stored
     }
  }

  logout(): void {
    this.authService.logout(); // Perform logout
    this.username = null; // Immediately clear username from UI
    this.isLoggedIn = false;
  }
}
