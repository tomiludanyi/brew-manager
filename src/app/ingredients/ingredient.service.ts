import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
	BehaviorSubject,
	catchError,
	combineLatest,
	map,
	Observable,
	ReplaySubject,
	share,
	shareReplay,
	switchMap
} from "rxjs";
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
		return this.http.get<Ingredient>(`${ this.ingredientsUrl }/${ id }`)
			.pipe(
				catchError(error => {
					console.error('Error fetching ingredient:', error);
					throw error;
				})
			);
	}
	
	addIngredient(ingredient: Ingredient) {
		return this.http.post(`${this.ingredientsUrl}/`, ingredient).pipe(
			switchMap(() => this.ingredients$),
			catchError(error => {
				console.error('Error adding ingredient:', error);
				throw error;
			})
		);
	}
	
	getIngredients(): Observable<Ingredient[]> {
		if (!this.ingredients$) {
			this.ingredients$ = this.http.get<Ingredient[]>(`${this.ingredientsUrl}/`).pipe(
				share({
					connector: () => new ReplaySubject(),
					resetOnRefCountZero: true,
					resetOnComplete: true,
					resetOnError: true
				}),
				shareReplay(),
				catchError(error => {
					console.error('Error fetching ingredients:', error);
					throw error;
				})
			)
		}
		return this.ingredients$;
	}
	
	getFilteredIngredients(filterText: string) {
		return this.ingredients$.pipe(
			map(ingredients => {
				return ingredients.filter(ingredient =>
					ingredient.name.toLowerCase().includes(filterText.toLowerCase())
				);
			}),
			catchError(error => {
				console.error('Error fetching filtered ingredients:', error);
				throw error;
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
			}),
			catchError(error => {
				console.error('Error fetching sorted ingredients:', error);
				throw error;
			})
		);
	}
	
	updateIngredient(newIngredient: Ingredient) {
		return this.http.put(`${this.ingredientsUrl}/${newIngredient.id}`, newIngredient)
			.pipe(
				catchError(error => {
					console.error('Error updating ingredient:', error);
					throw error;
				})
			);
	}
	
	deleteIngredient(id: number) {
		return this.http.delete(`${this.ingredientsUrl}/${id}`)
			.pipe(
				catchError(error => {
					console.error('Error deleting ingredient:', error);
					throw error;
				})
			);
	}
}
