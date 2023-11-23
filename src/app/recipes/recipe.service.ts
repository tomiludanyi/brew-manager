import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { shareReplay, Subject, switchMap, tap } from "rxjs";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>();
	
	private recipesUrl = 'http://localhost:3000/recipes';
	
	recipes$ = this.getRecipes();
	
	constructor(private http: HttpClient) {
	}
	
	getRecipe(id: number) {
		return this.http.get<Recipe>(`${ this.recipesUrl }/${ id }`);
	}
	
	getRecipes() {
		return this.http.get<Recipe[]>(`${ this.recipesUrl }/`).pipe(
			tap(recipes => this.recipesChanged.next(recipes)),
			shareReplay()
		);
	}
	
	addRecipe(recipe: Recipe) {
		return this.http.post(`${ this.recipesUrl }/`, recipe).pipe(
			switchMap(() => this.getRecipes())
		);
	}
}
