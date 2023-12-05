import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, of, switchMap } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-edit',
    templateUrl: './ingredient-edit.component.html',
    styleUrls: ['./ingredient-edit.component.css']
})
export class IngredientEditComponent implements OnInit {
    ingredientForm!: FormGroup;
    editMode = false;
    editedItem!: Ingredient;
    id!: number;
    
    constructor(private ingredientService: IngredientService, private route: ActivatedRoute, private router: Router) {
    }
    
    ngOnInit(): void {
        this.ingredientForm = new FormGroup({
            'name': new FormControl(null, Validators.required)
        });
        
        this.route.params.subscribe(params => {
            this.id = +params['id'];
            if (!isNaN(this.id)) {
                this.editMode = params['id'] != null;
                this.initForm();
            }
        });
    }
    
    private initForm() {
        if (this.editMode) {
            this.ingredientService.getIngredient(this.id).subscribe(ingredient => {
                if (ingredient) {
                    this.editedItem = ingredient;
                    this.ingredientForm.setValue({
                        name: this.editedItem.name
                    })
                }
            });
        }
    }
    
    onSubmit() {
        if (this.editMode) {
            const updatedIngredient: Ingredient = {
                id: this.editedItem.id,
                name: this.ingredientForm.get('name')?.value
            }
            this.ingredientService.updateIngredient(updatedIngredient).pipe(
                switchMap(() => {
                    return this.router.navigate(['ingredient-list']);
                }),
                catchError(error => {
                    console.error('Error updating ingredient:', error);
                    return of(null);
                })
            ).subscribe();
        } else {
            const newIngredient = this.ingredientForm.value;
            this.ingredientService.addIngredient(newIngredient).pipe(switchMap(() => {
                    this.ingredientForm.reset();
                    return this.router.navigate(['ingredient-list']);
                }),
                catchError(error => {
                    console.error('Error adding ingredient:', error);
                    return of(null);
                })
            ).subscribe();
        }
    }
}
