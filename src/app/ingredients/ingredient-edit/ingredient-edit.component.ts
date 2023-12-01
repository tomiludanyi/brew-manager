import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-edit',
    templateUrl: './ingredient-edit.component.html',
    styleUrls: ['./ingredient-edit.component.css']
})
export class IngredientEditComponent implements OnInit, OnDestroy {
    ingredientForm!: FormGroup;
    editMode = false;
    editedItem!: Ingredient;
    id!: number;
    
    private destroy$ = new Subject<void>();
    
    constructor(private ingredientService: IngredientService,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder) {
    }
    
    ngOnInit(): void {
        this.ingredientForm = this.fb.group({
            name: ['', Validators.required]
        });
        
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.id = +params['id'];
                if (!isNaN(this.id)) {
                    this.editMode = params['id'] != null;
                    this.initForm();
                }
            });
    }
    
    private initForm() {
        if (this.editMode) {
            this.ingredientService.getIngredient(this.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(ingredient => {
                    if (ingredient) {
                        this.editedItem = ingredient;
                        this.ingredientForm.setValue({
                            name: this.editedItem.name
                        });
                    }
                });
        }
    }
    
    onSubmit() {
        if (this.editMode) {
            const updatedIngredient: Ingredient = {
                id: this.editedItem.id,
                name: this.ingredientForm.get('name')?.value
            };
            
            this.ingredientService.updateIngredient(updatedIngredient)
                .pipe(
                    switchMap(() => this.router.navigate(['ingredient-list'])),
                    takeUntil(this.destroy$)
                )
                .subscribe();
        } else {
            const newIngredient = this.ingredientForm.value;
            
            this.ingredientService.addIngredient(newIngredient)
                .pipe(
                    switchMap(() => this.router.navigate(['ingredient-list'])),
                    takeUntil(this.destroy$)
                )
                .subscribe();
        }
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
