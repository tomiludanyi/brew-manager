import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {
    ingredients$!: Observable<Ingredient[]>;
    
    constructor(private ingredientService: IngredientService) {
    }
    
    ngOnInit(): void {
        this.ingredients$ = this.ingredientService.getIngredients();
    }
    
}
