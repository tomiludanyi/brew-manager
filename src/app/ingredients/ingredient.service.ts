import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private ingredientsUrl = 'http://localhost:3000';
    
    constructor(private http: HttpClient) {
    }
    
    getIngredient(id: number) {
        return this.http.get<Ingredient>(`${ this.ingredientsUrl }/ingredients/${ id }`);
    }
    
    getIngredients() {
        return this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/ingredients/`);
    }
    
    getFilteredIngredients(filterText: string) {
        return this.http.get<Ingredient[]>(`${ this.ingredientsUrl }/ingredients/`).pipe(
            map(ingredients => {
                return ingredients.filter(ingredient =>
                    ingredient.name.toLowerCase().includes(filterText.toLowerCase())
                );
            })
        );
    }
    
    updateIngredient(newIngredient: Ingredient) {
        return this.http.put(`${ this.ingredientsUrl }/ingredients/${ newIngredient.id }`, newIngredient);
    }
    
    deleteIngredient(id: number) {
        return this.http.delete(`${ this.ingredientsUrl }/ingredients/${ id }`);
    }
}
