import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    user = new BehaviorSubject(new User(true));
    isLoggedIn = false;
    
    constructor(private router: Router) {
    }
    
    login() {
        this.isLoggedIn = true;
    }
    
    logout() {
        this.isLoggedIn = false;
        this.router.navigate(['/admin/login']).then(r => r);
        localStorage.removeItem('userData');
    }
    
    setUser(user: User) {
        this.user.next(user);
    }
    
    getUser() {
        return this.user.value;
    }
}
