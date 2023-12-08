import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Recipe } from "../recipes/recipe.model";

@Injectable({
    providedIn: 'root'
})
export class BrewService {
    private selectedRecipeSubject = new BehaviorSubject<Recipe | null>(null);
    selectedRecipe$ = this.selectedRecipeSubject.asObservable();
    
    setSelectedRecipe(recipe: Recipe): void {
        this.selectedRecipeSubject.next(recipe);
    }
}
