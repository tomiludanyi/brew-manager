import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, ReplaySubject, share, shareReplay, Subject, switchMap } from "rxjs";
import { combineLatest } from "rxjs";
import { Recipe } from "./recipe.model";

@Injectable({ providedIn: 'root' })
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>();
	
	private recipesUrl = 'http://localhost:3000/recipes';
	
	recipes$ = this.getRecipes();
	
	private filterRecipeSubject = new BehaviorSubject<Recipe>({ id: 0, name: '', ingredients: [] });
	filterRecipesAction$ = this.filterRecipeSubject.asObservable();
	filteredRecipes$ = combineLatest([this.recipes$, this.filterRecipesAction$]).pipe(
		map(([recipes, filter]: [Recipe[], Recipe]) => {
			return recipes.filter(recipe => recipe.name.toLowerCase()
				.indexOf(filter?.name?.toLowerCase() ?? '') != -1);
		})
	);
	
	constructor(private http: HttpClient) {
	}
	
	getRecipe(id: number) {
		return this.http.get<Recipe>(`${ this.recipesUrl }/${ id }`);
	}
	
	addRecipe(recipe: Recipe) {
		return this.http.post(`${ this.recipesUrl }/`, recipe).pipe(
			switchMap(() => this.recipes$)
		);
	}
	
	getRecipes(): Observable<Recipe[]> {
		if (!this.recipes$) {
			this.recipes$ = this.http.get<Recipe[]>(`${ this.recipesUrl }/`).pipe(share({
					connector: () => new ReplaySubject(),
					resetOnRefCountZero: true,
					resetOnComplete: true,
					resetOnError: true
				}),
				shareReplay())
		}
		return this.recipes$;
	}
	
	getFilteredRecipes(filterText: string) {
		return this.recipes$.pipe(
			map(recipes => {
				return recipes.filter(recipe =>
					recipe.name.toLowerCase().includes(filterText.toLowerCase()));
			})
		);
	}
	
	getRecipesSortedBy(field: string, order: string) {
		return this.recipes$.pipe(
			map(recipes => {
				return recipes.sort((a, b) => {
					let x = a[field as keyof Recipe];
					let y = b[field as keyof Recipe];
					
					if (x == null || y == null) {
						return 0;
					}
					
					if (typeof x === "string" && typeof y === "string") {
						x = x.toLowerCase();
						y = y.toLowerCase();
					}
					
					const sortOrder = order === 'asc' ? 1 : -1;
					return x < y ? -sortOrder : x > y ? sortOrder : 0;
				});
			})
		);
	}
	
	updateRecipe(newRecipe: Recipe) {
		return this.http.put(`${ this.recipesUrl }/${ newRecipe.id }`, newRecipe);
	}
	
	deleteRecipe(id: number) {
		return this.http.delete(`${ this.recipesUrl }/${ id }`);
	}
}
