import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    
    isLoggedIn!: boolean;
    isLoggedInSubscription!: Subscription;
    
    constructor(private authService: AuthService) {
    }
    
    ngOnInit() {
        this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe((status: boolean) => {
            this.isLoggedIn = status;
        });
    }
    
    ngOnDestroy() {
        this.isLoggedInSubscription.unsubscribe();
    }
    
    logout() {
        this.authService.logout();
    }
}
