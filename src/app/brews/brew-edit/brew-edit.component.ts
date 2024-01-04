import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EMPTY, from, mergeMap, Subject, switchMap, take, takeUntil, toArray } from "rxjs";
import { Ingredient } from "../../ingredients/ingredient.model";
import { IngredientService } from "../../ingredients/ingredient.service";
import { Recipe } from "../../recipes/recipe.model";
import { Brew } from "../brew.model";
import { BrewService } from "../brew.service";

@Component({
    selector: 'app-brew-edit',
    templateUrl: './brew-edit.component.html',
    styleUrls: ['./brew-edit.component.css']
})
export class BrewEditComponent implements OnInit, OnDestroy {
    selectedRecipe: Recipe | null = null;
    ingredients: Ingredient[] = [];
    isEnoughAmount = true;
    brewForm!: FormGroup;
    today = new Date().toLocaleDateString('fr-ca');
    
    private destroy$ = new Subject<void>();
    
    constructor(private fb: FormBuilder,
                private brewService: BrewService,
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
        
        this.brewForm = this.fb.group({
            brewDate: [null, Validators.required]
        });
    }
    
    private checkIngredientAmount() {
        if (this.selectedRecipe && this.selectedRecipe.ingredients && this.ingredients.length > 0) {
            for (let i = 0; i < this.selectedRecipe.ingredients.length; i++) {
                const recipeIngredient = this.selectedRecipe.ingredients[i];
                const ingredientStock = this.ingredients[recipeIngredient.id - 1]?.stock;
                
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
        if (this.selectedRecipe && this.ingredients) {
            const newBrew: Brew = {
                id: 0,
                recipeId: this.selectedRecipe.id,
                startDate: this.brewForm.get('brewDate')?.value,
            };
            this.brewService.addBrew(newBrew).subscribe();
            
            this.brewService.selectedRecipe$
                .pipe(
                    take(1),
                    switchMap(selectedRecipe => {
                        return from(selectedRecipe?.ingredients ?? []);
                    }),
                    mergeMap(ingredient => {
                        const ingredientId = ingredient.id;
                        const requiredAmount = ingredient.amount;
                        
                        if (requiredAmount !== undefined) {
                            const ingredientIndex = this.ingredients.findIndex(i => i.id === ingredientId);
                            
                            if (ingredientIndex !== -1) {
                                this.ingredients[ingredientIndex].stock! -= requiredAmount;
                                
                                return this.ingredientService.updateIngredient(this.ingredients[ingredientIndex]);
                            } else {
                                console.error('Ingredient not found in the array:', ingredientId);
                                return EMPTY;
                            }
                        } else {
                            console.error('Required amount is undefined for ingredient:', ingredient);
                            return EMPTY;
                        }
                    }),
                    toArray(),
                    takeUntil(this.destroy$)
                )
                .subscribe(
                    () => {
                        console.log('Ingredients updated successfully');
                    },
                    error => {
                        console.error('Error updating ingredients:', error);
                    }
                );
        }
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
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    
}
