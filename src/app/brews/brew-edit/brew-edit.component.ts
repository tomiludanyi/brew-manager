import { Component, OnInit } from '@angular/core';
import { Ingredient } from "../../ingredients/ingredient.model";
import { IngredientService } from "../../ingredients/ingredient.service";
import { Recipe } from "../../recipes/recipe.model";
import { BrewService } from "../brew.service";

@Component({
    selector: 'app-brew-edit',
    templateUrl: './brew-edit.component.html',
    styleUrls: ['./brew-edit.component.css']
})
export class BrewEditComponent implements OnInit {
    selectedRecipe: Recipe | null = null;
    ingredients: Ingredient[] = [];
    isEnoughAmount = true;
    
    constructor(private brewService: BrewService,
                private ingredientService: IngredientService) {
    }
    
    ngOnInit(): void {
        this.brewService.selectedRecipe$.subscribe(recipe => {
            this.selectedRecipe = recipe;
        });
        
        this.ingredientService.ingredients$.subscribe(ingredients => {
            this.ingredients = ingredients;
        });
        this.checkIngredientAmount();
    }
    
    private checkIngredientAmount() {
        if (this.selectedRecipe && this.selectedRecipe.ingredients && this.ingredients.length > 0) {
            for (let i = 0; i < this.selectedRecipe.ingredients.length; i++) {
                const recipeIngredient = this.selectedRecipe.ingredients[i];
                const ingredientStock = this.ingredients[recipeIngredient.id -1]?.stock;
                
                if (
                    recipeIngredient.amount === undefined ||
                    ingredientStock === undefined ||
                    recipeIngredient.amount > ingredientStock
                ) {
                    this.isEnoughAmount = false;
                    return;
                }
            }
            this.isEnoughAmount = true;
        }
    }
    
    onSubmit() {
        
    }
    
    getIngredientStock(index: number) {
        const ingredient = this.selectedRecipe?.ingredients[index];
        const ingredientId = ingredient?.id;
        const ingredientData = ingredientId ? this.ingredients[ingredientId - 1] : undefined;
        return ingredientData?.stock || 0;
    }
    
    
    isStockInsufficient(index: number) {
        const stock = this.getIngredientStock(index);
        const amount = this.selectedRecipe?.ingredients[index].amount || 0;
        return stock < amount;
    }
}
