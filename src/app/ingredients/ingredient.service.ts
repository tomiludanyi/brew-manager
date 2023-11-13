import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject, switchMap, tap } from "rxjs";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private ingredientsUrl = 'http://localhost:3000/ingredients';
    refreshIngredients = new Subject<Ingredient[]>() ;
    
    constructor(private http: HttpClient) {
    }
    
    getIngredient(id: number) {
        return this.http.get<Ingredient>(`${ this.ingredientsUrl }/${ id }`);
    }
    
    addIngredient(ingredient: Ingredient) {
        return this.http.post(`${ this.ingredientsUrl }/`, ingredient).pipe(
            switchMap(() => this.getIngredients())
        );
    }
    
    getIngredients() {
        return this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/`).pipe(
            tap(ingredients => this.refreshIngredients.next(ingredients))
        );
    }
    
    getFilteredIngredients(filterText: string) {
        return this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/`).pipe(
            map(ingredients => {
                return ingredients.filter(ingredient =>
                    ingredient.name.toLowerCase().includes(filterText.toLowerCase())
                );
            })
        );
    }
    
    getIngredientsSortedBy(field: string, order: string) {
        return this.http.get<Ingredient[]>(`${ this.ingredientsUrl }`).pipe(
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
