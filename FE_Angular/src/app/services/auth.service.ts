import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { AppConstants } from '../constants/app-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = AppConstants.buildApiUrl(AppConstants.API.AUTH.LEGACY_LOGIN);

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, payload).pipe(
      tap((response) => {
        localStorage.setItem(AppConstants.STORAGE_KEYS.TOKEN, response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AppConstants.STORAGE_KEYS.TOKEN);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(AppConstants.STORAGE_KEYS.TOKEN);
  }
}
