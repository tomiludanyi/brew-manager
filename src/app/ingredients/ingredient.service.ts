import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private ingredientsUrl = 'http://localhost:3000/ingredients';
    
    constructor(private http: HttpClient) {
    }
    
    getIngredient(id: number) {
        return this.http.get<Ingredient>(`${ this.ingredientsUrl }/${ id }`);
    }
    
    addIngredient(ingredient: Ingredient) {
        return this.http.post(`${ this.ingredientsUrl }/`, ingredient);
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
    
    updateIngredient(newIngredient: Ingredient) {
        return this.http.put(`${ this.ingredientsUrl }/${ newIngredient.id }`, newIngredient);
    }
    
    deleteIngredient(id: number) {
        return this.http.delete(`${ this.ingredientsUrl }/${ id }`);
    }
}
