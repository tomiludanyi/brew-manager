import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    map,
    Observable, of,
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
    
    private filterIngredientSubject = new BehaviorSubject<Ingredient>({ id: 0, name: '', stock: 0, unit: '' });
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
    
    getIngredientByName(name: string): Observable<Ingredient | null> {
        return this.http.get<Ingredient[]>(`${this.ingredientsUrl}?name=${name}`)
            .pipe(
                map(ingredients => ingredients.length > 0 ? ingredients[0] : null),
                catchError(error => {
                    console.error('Error fetching ingredient:', error);
                    return of(null);
                })
            );
    }
    
    addIngredient(ingredient: Ingredient) {
        return this.http.post(`${ this.ingredientsUrl }/`, ingredient).pipe(
            switchMap(() => this.ingredients$),
            catchError(error => {
                console.error('Error adding ingredient:', error);
                throw error;
            })
        );
    }
    
    getIngredients(): Observable<Ingredient[]> {
        if (!this.ingredients$) {
            this.ingredients$ = this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/`).pipe(
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
                    const x = this.getPropertyValue(a, field);
                    const y = this.getPropertyValue(b, field);
                    
                    if (typeof x === "string" && typeof y === "string") {
                        return order === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
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
    
    private getPropertyValue(obj: any, property: string) {
        const properties = property.split('.');
        let value = obj;
        
        for (const prop of properties) {
            value = value?.[prop];
        }
        
        return value;
    }
    
    updateIngredient(newIngredient: Ingredient) {
        return this.http.put(`${ this.ingredientsUrl }/${ newIngredient.id }`, newIngredient)
            .pipe(
                catchError(error => {
                    console.error('Error updating ingredient:', error);
                    throw error;
                })
            );
    }
    
    deleteIngredient(id: number) {
        return this.http.delete(`${ this.ingredientsUrl }/${ id }`)
            .pipe(
                catchError(error => {
                    console.error('Error deleting ingredient:', error);
                    throw error;
                })
            );
    }
}
