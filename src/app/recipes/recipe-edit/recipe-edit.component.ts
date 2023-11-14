import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Ingredient } from "../../ingredients/ingredient.model";
import { IngredientService } from "../../ingredients/ingredient.service";

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
    recipeForm!: FormGroup;
    ingredients: Ingredient[] = [];
    
    constructor(private ingredientService: IngredientService) {
    }
    
    ngOnInit(): void {
        this.ingredientService.getIngredients().subscribe(ingredients => {
            this.ingredients = ingredients;
        });
        this.recipeForm = new FormGroup({
            'name': new FormControl(null, Validators.required),
            'ingredient': new FormControl(null)
        });
    }
    
    onSubmit() {
        
    }
}
