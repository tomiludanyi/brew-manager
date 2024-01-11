import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, ReplaySubject, share, shareReplay } from "rxjs";
import { Recipe } from "../recipes/recipe.model";
import { Brew } from "./brew.model";

@Injectable({
    providedIn: 'root'
})
export class BrewService {
    private brewsUrl = 'http://localhost:3000/brews';
    
    brews$ = this.getBrews();
    
    private selectedRecipeSubject = new BehaviorSubject<Recipe | null>(null);
    selectedRecipe$ = this.selectedRecipeSubject.asObservable();
    
    private isBrewSource = new BehaviorSubject<boolean>(true);
    isBrew$ = this.isBrewSource.asObservable();
    
    private isRedHighlightVisible = new BehaviorSubject<boolean>(false);
    isRedHighlightVisible$ = this.isRedHighlightVisible.asObservable();
    
    constructor(private http: HttpClient) {
    }
    
    addBrew(brew: Brew) {
        return this.http.post<Brew>(this.brewsUrl, brew);
    }
    
    setSelectedRecipe(recipe: Recipe): void {
        this.selectedRecipeSubject.next(recipe);
    }
    
    getBrews(): Observable<Brew[]> {
        if (!this.brews$) {
            this.brews$ = this.http.get<Brew[]>(`${ this.brewsUrl }/`).pipe(
                share({
                    connector: () => new ReplaySubject(),
                    resetOnRefCountZero: true,
                    resetOnComplete: true,
                    resetOnError: true
                }),
                shareReplay(),
                catchError(error => {
                    console.error('Error fetching brews:', error);
                    throw error;
                })
            )
        }
        return this.brews$;
    }
    
    getBrewsSortedBy(field: string, order: string) {
        return this.brews$.pipe(
            map(brews => {
                return brews.sort((a, b) => {
                    const x = this.getPropertyValue(a, field);
                    const y = this.getPropertyValue(b, field);
                    
                    if (typeof x === "string" && typeof y === "string") {
                        return order === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
                    }
                    
                    const sortOrder = order === 'asc' ? 1 : -1;
                    return x < y ? -sortOrder : x > y ? sortOrder : 0;
                })
            }),
            catchError(error => {
                console.error('Error fetching sorted brews:', error);
                throw error;
            })
        );
    }
    
    private getPropertyValue(obj: any, property: string) {
        const properties = property.split('.');
        let value = obj;
        
        for (const prop of properties) {
            value = value?.[prop];
        }
        return value;
    }
    
    setBrew(isVisible: boolean) {
        this.isBrewSource.next(isVisible);
    }
    
    setRedHighlight(isVisible: boolean) {
        this.isRedHighlightVisible.next(isVisible);
    }
}
