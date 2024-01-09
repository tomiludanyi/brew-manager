import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, of, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    userFound: boolean;
    token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    user = new BehaviorSubject<User>(new User('', '', '', new Date()));
    private tokenExpirationTimer: any;
    private serverUrl = 'http://localhost:2000';
    
    constructor(private http: HttpClient, private router: Router) {
    }
    
    signup(email: string, password: string) {
        this.http.post<AuthResponseData>(`${this.serverUrl}/users`, {
            email: email,
            password: password,
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                if (resData.userFound && resData.token) {
                    this.handleAuthentication(email, resData.token);
                }
            })
        ).subscribe();
    }
    
    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(`${this.serverUrl}/login`, {
            email: email,
            password: password,
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                if (resData.userFound && resData.token) {
                    this.handleAuthentication(email, resData.token);
                }
            })
        ).subscribe();
    }
    
    getUser() {
        return this.http.get<User>(`${this.serverUrl}/get-user`, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`
            }
        }).pipe(
            catchError(this.handleError),
            tap(user => {
                if (user) {
                    this.user.next(user);
                }
            })
        );
    }
    
    logout() {
        this.user.next(new User('', '', '', new Date()));
        this.router.navigate(['/admin/login']).then(r => r);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }
    
    autoLogin() {
        const userDataString = localStorage.getItem('userData');
        
        if (!userDataString) {
            return of(false);
        }
        
        const userData: {
            email: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(userDataString);
        
        if (!userData) {
            return of(false);
        }
        
        const loadedUser = new User(userData.email, '', userData._token, new Date(userData._tokenExpirationDate));
        
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
            
            return of(true);
        } else {
            return of(false);
        }
    }
    
    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
    
    private handleAuthentication(email: string, token: string) {
        const user = new User(email, '', token, this.calculateExpirationDate(3600)); // 1 hour expiration
        this.user.next(user);
        this.autoLogout(3600 * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
    
    private calculateExpirationDate(expirationInSeconds: number): Date {
        return new Date(new Date().getTime() + expirationInSeconds * 1000);
    }
    
    private getToken(): string | null {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userData: { _token: string } = JSON.parse(userDataString);
            return userData._token;
        }
        return null;
    }
    
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.message) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email already exists.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'The email could not be found.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid password.';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'Invalid login credentials!';
                break;
        }
        return throwError(errorMessage);
    }
}
