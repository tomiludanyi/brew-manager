import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { User } from "./user.model";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    
    user: User = new User(false);
    
    constructor(private router: Router, private authService: AuthService) {
    }
    
    onSubmit(role: string) {
        if (role === 'Admin') {
            this.user.isAdmin = true;
            this.router.navigate(['/brewery']).then(r => r);
        } else if (role === 'Worker') {
            this.user.isAdmin = false;
            this.router.navigate(['/ingredient-list']).then(r => r);
        }
        this.authService.setUser(this.user);
        this.authService.login();
    }
}
