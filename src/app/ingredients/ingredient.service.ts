import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private ingredientsUrl = 'http://localhost:3000';
    
    constructor(private http: HttpClient) {
    }
    
    getIngredient(id: number) {
        return this.http.get<Ingredient>(`${this.ingredientsUrl}/ingredients/${id}`);
    }
    
    getIngredients() {
        return this.http.get<Ingredient[]>(`${this.ingredientsUrl}/ingredients/`);
    }
    
    updateIngredient(newIngredient: Ingredient) {
        return this.http.put(`${this.ingredientsUrl}/ingredients/${newIngredient.id}`, newIngredient);
    }
}
