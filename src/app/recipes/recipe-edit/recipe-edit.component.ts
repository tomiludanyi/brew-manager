import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Ingredient } from "../../ingredients/ingredient.model";
import { IngredientService } from "../../ingredients/ingredient.service";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
	selector: 'app-recipe-edit',
	templateUrl: './recipe-edit.component.html',
	styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnChanges, OnDestroy {
	@Input() editedRecipe!: Recipe;
	@Input() isEditMode: boolean = false;
	
	recipeForm!: FormGroup;
	ingredients$ = this.ingredientService.ingredients$;
	editMode = false;
	id!: number;
	selectedIngredients: Ingredient[] = [];
	
	private destroy$ = new Subject<void>();
	
	constructor(private route: ActivatedRoute,
	            private recipeService: RecipeService,
	            private ingredientService: IngredientService,
	            private fb: FormBuilder) {
	}
	
	get controls() {
		return (<FormArray>this.recipeForm.get('ingredients')).controls;
	}
	
	ngOnInit(): void {
		this.route.params
			.pipe(takeUntil(this.destroy$))
			.subscribe((params: Params) => {
				this.id = +params['id'];
				this.editMode = params['id'] != null;
			});
		this.recipeFormInit();
	}
	
	ngOnChanges(): void {
		if (this.isEditMode && this.editedRecipe) {
			this.recipeForm.patchValue({
				id: this.editedRecipe.id,
				name: this.editedRecipe.name,
				ingredients: this.editedRecipe.ingredients
			});
			
			const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
			ingredientsArray.clear();
			
			this.editedRecipe.ingredients.forEach(ingredient => {
				const ingredientGroup = this.fb.group({
					id: ingredient.id,
					name: [ingredient.name, Validators.required]
				});
				ingredientsArray.push(ingredientGroup);
			});
		} else {
			this.recipeFormInit();
		}
	}
	
	recipeFormInit() {
		this.recipeForm = this.fb.group({
			id: null,
			name: ['', Validators.required],
			ingredients: this.fb.array([])
		});
		this.addIngredientField();
	}
	
	onSubmit() {
		const formValue = this.recipeForm.value;
		
		if (this.isEditMode) {
			const updatedRecipe: Recipe = {
				id: formValue.id,
				name: formValue.name,
				ingredients: formValue.ingredients.map((ingredient: { id: number, name: string }) => ({ id: ingredient.id, name: ingredient.name })),
			};
			
			this.recipeService.updateRecipe(updatedRecipe)
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => {
					console.log('Recipe updated successfully');
					this.isEditMode = false;
					this.clearIngredientFields();
				});
		} else {
			this.recipeService.addRecipe(new Recipe(null, formValue.name, this.selectedIngredients))
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => {
					console.log('Recipe added successfully');
					this.clearIngredientFields();
				});
		}
	}
	
	clearIngredientFields() {
		this.recipeFormInit();
		const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
		ingredientsArray.clear();
		this.selectedIngredients = [];
	}
	
	addIngredientField() {
		(<FormArray>this.recipeForm.get('ingredients')).push(
			new FormGroup({
				'name': new FormControl(null, Validators.required),
			})
		);
	}
	
	onOptionChange(event: any) {
		const selectedIngredientName = event.target.value;
		if (!this.selectedIngredients.some(ingredient => ingredient.name === selectedIngredientName)) {
			this.ingredients$.pipe(takeUntil(this.destroy$))
				.subscribe(ingredients => {
					const selectedIngredient = ingredients.find(ingredient => ingredient.name === selectedIngredientName);
					if (selectedIngredient) {
						this.selectedIngredients.push(selectedIngredient);
					}
				});
		}
	}
	
	isSelected(ingredient: Ingredient): boolean {
		return this.selectedIngredients.includes(ingredient);
	}
	
	removeIngredient(index: number) {
		this.selectedIngredients.splice(index, 1);
		(<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
		if (this.selectedIngredients.length === 0) {
			this.addIngredientField();
		}
	}
	
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
