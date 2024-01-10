import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    
    constructor(private router: Router, private authService: AuthService) {
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.getUser().isAdmin) {
            return true;
        } else {
            return this.router.navigate(['/admin/login']);
        }
    }
}
