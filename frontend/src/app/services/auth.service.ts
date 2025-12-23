import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/api/auth/signup`,
      { email: email, password: password }
    );
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string) {
    return this.http
      .post<{ userId: string; token: string }>(
        `${environment.apiUrl}/api/auth/login`,
        { email: email, password: password }
      )
      .pipe(
        tap(({ userId, token }) => {
          this.userId = userId;
          this.authToken = token;
          this.isAuth$.next(true);

          // STOCKER DANS localStorage pour persistance au refresh
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
        })
      );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);

    // SUPPRIMER du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    this.router.navigate(['login']);
  }

  // Méthode pratique pour le guard
  isAuthenticated(): boolean {
    return !!this.authToken;
  }
  forceLogout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}
