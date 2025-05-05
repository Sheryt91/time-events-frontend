import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth'; 
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(this.getUsername());

  public username$=this.usernameSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {}

  // Login and store both token and username
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string, username: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('inside authservice login',response.token,response.username)
            // Save token and username to localStorage or sessionStorage
        this.saveToken(response.token);
        this.saveUsername(response.username);

        // Update login state in BehaviorSubject
        this.loggedInSubject.next(true);
        this.usernameSubject.next(response.username);
        })
      );
  }
 
  // Save the JWT token
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Save the username
  saveUsername(username: string) {
    localStorage.setItem('username', username);
  }

  // Get the JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get the username
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
// Check if the user is logged in
isLoggedIn(): Observable<boolean> {
  return this.loggedInSubject.asObservable(); // Using the BehaviorSubject to track login status
}

// Check initial login state
private checkInitialLoginState(): boolean {
  return !!this.getToken();
}

  // Logout and clear the token and username
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
      this.loggedInSubject.next(false); // Update login state
    this.usernameSubject.next(null);
    this.router.navigate(['/login']);
  }

  
  // Validate the token to check if it is expired or invalid
  isTokenValid(token: string): boolean {
    try {
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

      // Check if the token has expired
      return decodedToken.exp > currentTime;  // true if not expired, false if expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;  // Return false if there's an error decoding the token
    }
  }

  getRolesFromToken(token: string): string[] {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || [];  // Return roles from the token payload
    } catch (e) {
      console.error('Error decoding token:', e);
      return [];
    }
  }
  

}
