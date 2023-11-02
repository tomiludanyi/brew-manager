import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class IngredientService {
    private dbUrl = 'assets/db.json';
    
    constructor(private http: HttpClient) {
    }
    
    getIngredients() {
        return this.http.get<{ ingredients: Ingredient[] }>(this.dbUrl)
            .pipe(map(response => response.ingredients));
    }
}
