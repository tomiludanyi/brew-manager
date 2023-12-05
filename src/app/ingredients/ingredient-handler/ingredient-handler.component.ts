import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-handler',
    templateUrl: './ingredient-handler.component.html',
    styleUrls: ['./ingredient-handler.component.css']
})
export class IngredientHandlerComponent implements OnInit {
    ingredientForm!: FormGroup;
    ingredients$ = this.ingredientService.ingredients$;
    availableUnits: string[] = [];
    
    constructor(private fb: FormBuilder, private ingredientService: IngredientService) {
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
    
    onOptionChange(event: any) {
        const selectedIngredientName = event.target.value;
        
        this.ingredients$.subscribe(ingredients => {
            const selectedIngredient = ingredients.find(ingredient => ingredient.name === selectedIngredientName);
            
            if (selectedIngredient) {
                const selectedUnit = selectedIngredient.unit;
            }
        });
    }
    
    onSubmit() {
    }
}
