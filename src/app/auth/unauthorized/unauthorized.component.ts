import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html'
})
export class UnauthorizedComponent implements OnInit {
    isLoggedIn!: boolean;
    
    constructor(private authService: AuthService) {}
    
    ngOnInit() {
        this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        });
    }
}
