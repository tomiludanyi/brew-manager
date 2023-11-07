import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private ingredientsUrl = 'http://localhost:3000/ingredients';
    
    constructor(private http: HttpClient) {
    }
    
    getIngredient(id: number) {
        return this.http.get<Ingredient>(`${ this.ingredientsUrl }/${ id }`);
    }
    
    getIngredients() {
        return this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/`);
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
    
    getIngredientsSortedBy(field: string, order: string): Observable<Ingredient[]> {
        const url = `${this.ingredientsUrl}?_sort=${field}&_order=${order}`;
        return this.http.get<Ingredient[]>(url);
    }
    
    updateIngredient(newIngredient: Ingredient) {
        return this.http.put(`${ this.ingredientsUrl }/${ newIngredient.id }`, newIngredient);
    }
    
    deleteIngredient(id: number) {
        return this.http.delete(`${ this.ingredientsUrl }/${ id }`);
    }
}
