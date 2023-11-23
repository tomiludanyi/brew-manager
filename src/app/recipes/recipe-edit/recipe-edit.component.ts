import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
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
	recipeIngredients = new FormArray<any>([]);
	editMode = false;
	id!: number;
	editedItem!: Recipe;
	
	constructor(private route: ActivatedRoute, 
	            private recipeService: RecipeService, 
	            private router: Router,
	            private ingredientService: IngredientService) {
	}
	
	get controls() {
		return (<FormArray>this.recipeForm.get('ingredients')).controls;
	}
	
	ngOnInit(): void {
		this.route.params
			.subscribe((params: Params)=> {
				this.id = +params['id'];
				this.editMode = params['id'] != null;
			})
		this.initForm();
	}
	
	private initForm() {
		let recipeName = '';
		if (this.editMode) {
			this.recipeService.getRecipe(this.id).subscribe(recipe => {
				if (recipe) {
					this.editedItem = recipe;
					recipeName = recipe.name;
					if (recipe['ingredients']) {
						for (let ingredient of recipe.ingredients) {
							this.recipeIngredients.push(
								new FormGroup({
									'name': new FormControl(ingredient.name, Validators.required)
								})
							);
						}
					}
				}
			});			
		}
		
		this.recipeForm = new FormGroup({
			'name': new FormControl(recipeName, Validators.required),
			'ingredients': this.recipeIngredients
		});
	}
	
	onSubmit() {
		this.recipeService.addRecipe(this.recipeForm.value);
		this.recipeForm.reset();
		// this.onCancel();
	}
	
	addIngredient() {
		(<FormArray>this.recipeForm.get('ingredients')).push(
			new FormGroup({
				'name': new FormControl(null, Validators.required),
			})
		);
	}
	
	// removeIngredient(i: number) {
	// 	(<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
	// }
	
	// onCancel() {
	 	// this.router.navigate(['../'], { relativeTo: this.route });
	// }
	
}
