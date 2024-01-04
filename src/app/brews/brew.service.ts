import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Recipe } from "../recipes/recipe.model";
import { Brew } from "./brew.model";

@Injectable({
    providedIn: 'root'
})
export class BrewService {
    private brewsUrl = 'http://localhost:3000/brews';
    
    private selectedRecipeSubject = new BehaviorSubject<Recipe | null>(null);
    selectedRecipe$ = this.selectedRecipeSubject.asObservable();
    
    constructor(private http: HttpClient) {
    }
    
    addBrew(brew: Brew) {
        return this.http.post<Brew>(this.brewsUrl, brew);
    }
    
    setSelectedRecipe(recipe: Recipe): void {
        this.selectedRecipeSubject.next(recipe);
    }
}
