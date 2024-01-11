import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "./auth.service";
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    
    allowedPaths = [
        'ingredient-list',
        'ingredient-handler',
    ];
    
    constructor(private router: Router, private authService: AuthService) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.isLoggedIn$.pipe(
            take(1),
            map(isLoggedIn => {
                const isAllowedPath = this.allowedPaths.some(path => state.url.includes(path));
                if ((isAllowedPath && isLoggedIn) || (isLoggedIn && this.authService.getUser()?.isAdmin)) {
                    return true;
                } else {
                    this.router.navigate(['unauthorized']).then(r => r);
                    return false;
                }
            })
        );
    }
}
