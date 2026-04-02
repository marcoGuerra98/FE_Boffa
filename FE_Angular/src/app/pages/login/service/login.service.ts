import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { LoginRequest } from '../../../models/login-request.model';
import { LoginResponse } from '../../../models/login-response.model';
import { AppConstants } from '../../../constants/app-constants';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private readonly endpoint = AppConstants.buildApiUrl(AppConstants.API.AUTH.LOGIN);

    constructor(private http: HttpClient) {}

    logIn(username: string, password: string): Observable<void> {
        const payload: LoginRequest = { username, password };
        console.log('LoginService: Sending login request with payload', payload);

        return this.http.post<LoginResponse>(this.endpoint, payload).pipe(
            tap((response) => {
                console.log('LoginService: Received login response', response);
                localStorage.setItem(AppConstants.STORAGE_KEYS.TOKEN, response.token);
            }),
            map(() => void 0)
        );
    }
}