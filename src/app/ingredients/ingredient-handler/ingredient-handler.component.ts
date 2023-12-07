import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { of, Subject, switchMap, takeUntil } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-handler',
    templateUrl: './ingredient-handler.component.html',
    styleUrls: ['./ingredient-handler.component.css']
})
export class IngredientHandlerComponent implements OnInit, OnDestroy {
    ingredientForm!: FormGroup;
    ingredients$ = this.ingredientService.ingredients$;
    availableUnits: string[] = [];
    selectedIngredient!: Ingredient;
    private destroy$ = new Subject<void>();
    
    constructor(private fb: FormBuilder,
                private ingredientService: IngredientService,
                private router: Router) {
    }
    
    ngOnInit(): void {
        this.ingredientForm = this.fb.group({
            name: [null, Validators.required],
            stock: [null, Validators.required],
            unit: [{ value: null, disabled: false }, Validators.required]
        });
        
        this.ingredientForm.get('name')!.valueChanges.subscribe(selectedIngredient => {
            if (selectedIngredient) {
                this.ingredientForm.get('unit')!.setValue(selectedIngredient.unit);
            } else {
                this.ingredientForm.get('unit')!.setValue(null);
            }
        });
        
        this.ingredients$.subscribe(ingredients => {
            this.availableUnits = Array.from(new Set(ingredients.map(ingredient => ingredient.unit)));
        });
    }
    
    onOptionChange() {
        const selectedIngredientName = this.ingredientForm.get('name')?.value.name;
        
        this.ingredientService.getIngredientByName(selectedIngredientName)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(ingredient => {
                    if (ingredient) {
                        this.selectedIngredient = ingredient;
                    }
                    return of(null);
                })
            )
            .subscribe();
    }
    
    onSubmit() {
        const updatedIngredient: Ingredient = {
            id: this.selectedIngredient?.id,
            name: this.selectedIngredient?.name,
            unit: this.selectedIngredient?.unit,
            stock: this.selectedIngredient.stock
        };
        if (this.selectedIngredient?.unit === this.ingredientForm.get('unit')?.value) {
            updatedIngredient.stock += this.ingredientForm.get('stock')?.value;
            this.updateIngredientAndNavigate(updatedIngredient);
        } else if (this.selectedIngredient.unit === 'g' && this.ingredientForm.get('unit')?.value === 'kg') {
            updatedIngredient.stock += this.ingredientForm.get('stock')?.value * 1000;
            this.updateIngredientAndNavigate(updatedIngredient);
        } else if (this.selectedIngredient.unit === 'kg' && this.ingredientForm.get('unit')?.value === 'g') {
            updatedIngredient.stock += this.ingredientForm.get('stock')?.value / 1000;
            this.updateIngredientAndNavigate(updatedIngredient);
        } else if (this.selectedIngredient.unit === 'ml' && this.ingredientForm.get('unit')?.value === 'l') {
            updatedIngredient.stock += this.ingredientForm.get('stock')?.value * 1000;
            this.updateIngredientAndNavigate(updatedIngredient);
        } else if (this.selectedIngredient.unit === 'l' && this.ingredientForm.get('unit')?.value === 'ml') {
            updatedIngredient.stock += this.ingredientForm.get('stock')?.value / 1000;
            this.updateIngredientAndNavigate(updatedIngredient);
        } else {
            alert('The selected unit is not applicable for this ingredient!');
        }
    }
    
    private updateIngredientAndNavigate(updatedIngredient: Ingredient) {
        this.ingredientService.updateIngredient(updatedIngredient)
            .pipe(
                switchMap(() => this.router.navigate(['ingredient-list'])),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
