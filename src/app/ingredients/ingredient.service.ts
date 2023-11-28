import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, ReplaySubject, share, shareReplay, switchMap } from "rxjs";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
	private ingredientsUrl = 'http://localhost:3000/ingredients';
	
	ingredients$ = this.getIngredients();
	
	private filterIngredientSubject = new BehaviorSubject<Ingredient>({ id: 0, name: '' });
	filterIngredientsAction$ = this.filterIngredientSubject.asObservable();
	
	filteredIngredients$ = combineLatest([this.ingredients$, this.filterIngredientsAction$]).pipe(
		map(([ingredients, filter]: [Ingredient[], Ingredient]) => {
			return ingredients.filter(ingredient => ingredient.name.toLowerCase()
				.indexOf(filter?.name?.toLowerCase() ?? '') != -1)
		})
	);
	
	constructor(private http: HttpClient) {
	}
	
	getIngredient(id: number) {
		return this.http.get<Ingredient>(`${ this.ingredientsUrl }/${ id }`);
	}
	
	addIngredient(ingredient: Ingredient) {
		return this.http.post(`${ this.ingredientsUrl }/`, ingredient).pipe(
			switchMap(() => this.ingredients$)
		);
	}
	
	getIngredients(): Observable<Ingredient[]> {
		if (!this.ingredients$) {
			this.ingredients$ = this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/`).pipe(share({
					connector: () => new ReplaySubject(),
					resetOnRefCountZero: true,
					resetOnComplete: true,
					resetOnError: true
				}),
				shareReplay())
		}
		return this.ingredients$;
	}
	
	getFilteredIngredients(filterText: string) {
		return this.ingredients$.pipe(
			map(ingredients => {
				return ingredients.filter(ingredient =>
					ingredient.name.toLowerCase().includes(filterText.toLowerCase())
				);
			})
		);
	}
	
	getIngredientsSortedBy(field: string, order: string) {
		return this.ingredients$.pipe(
			map(ingredients => {
				return ingredients.sort((a, b) => {
					let x = a[field as keyof Ingredient];
					let y = b[field as keyof Ingredient];
					if (typeof x === "string" && typeof y === "string") {
						x = x.toLowerCase();
						y = y.toLowerCase();
					}
					const sortOrder = order === 'asc' ? 1 : -1;
					return x < y ? -sortOrder : x > y ? sortOrder : 0;
				});
			}));
	}
	
	updateIngredient(newIngredient: Ingredient) {
		return this.http.put(`${ this.ingredientsUrl }/${ newIngredient.id }`, newIngredient);
	}
	
	deleteIngredient(id: number) {
		return this.http.delete(`${ this.ingredientsUrl }/${ id }`);
	}
}
