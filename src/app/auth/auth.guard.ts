import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, switchMap, of } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    
    constructor(private router: Router, private authService: AuthService) {
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user.pipe(
            switchMap(user => {
                if (!user) {
                    return this.authService.autoLogin().pipe(map(autoLoginSuccess => {
                        if (autoLoginSuccess) {
                            return true;
                        } else {
                            return this.router.createUrlTree(['/admin/login']);
                        }
                    }));
                } else {
                    return of(true);
                }
            })
        );
    }
}
