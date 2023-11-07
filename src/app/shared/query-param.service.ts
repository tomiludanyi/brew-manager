import { Injectable } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class QueryParamService {
    constructor(private router: Router, private route: ActivatedRoute) {
    }
    
    getQueryParam(key: string): Observable<string | null> {
        return this.route.queryParamMap.pipe(map(params => params.get(key)));
    }
    
    setQueryParam(key: string, value: string): void {
        const queryParams: Params = { [key]: value };
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
        }).then(r => r);
    }
}
