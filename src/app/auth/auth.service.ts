import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    user = new BehaviorSubject(new User(true));
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    
    constructor(private router: Router) {
    }
    
    login() {
        this.isLoggedInSubject.next(true);
    }
    
    logout() {
        this.isLoggedInSubject.next(false);
        const currentUser = this.user.value;
        
        if (currentUser) {
            currentUser.isAdmin = false;
            this.setUser(currentUser);
        }
        localStorage.removeItem('userData');
        this.router.navigate(['/admin/login']).then(r => r);
    }
    
    setUser(user: User) {
        this.user.next(user);
    }
    
    getUser() {
        return this.user.value;
    }
}
