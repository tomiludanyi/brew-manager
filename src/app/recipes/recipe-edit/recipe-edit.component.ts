import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { Ingredient } from "../../ingredients/ingredient.model";
import { IngredientService } from "../../ingredients/ingredient.service";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
	selector: 'app-recipe-edit',
	templateUrl: './recipe-edit.component.html',
	styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
	recipeForm!: FormGroup;
	ingredients$ = this.ingredientService.ingredients$;
	editMode = false;
	id!: number;
	selectedIngredients: Ingredient[] = [];
	
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
			.subscribe((params: Params) => {
				this.id = +params['id'];
				this.editMode = params['id'] != null;
			})
		
		this.recipeForm = this.fb.group({
			name: ['', Validators.required],
			ingredients: this.fb.array([])
		});
		this.addIngredientField();
	}
	
	onSubmit() {
		this.recipeService.addRecipe(new Recipe( null, this.recipeForm.get('name')?.value, this.selectedIngredients )).subscribe();
		this.recipeForm.reset();
		const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
		ingredientsArray.clear();
		this.selectedIngredients = [];
		this.addIngredientField();
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
			this.ingredients$.subscribe(ingredients => {
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
}
