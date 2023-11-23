import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IngredientService } from "../../ingredients/ingredient.service";
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
			name: [''],
			ingredients: this.fb.array([])
		});
	}
	
	onSubmit() {
		this.recipeService.addRecipe(this.recipeForm.value).subscribe();
		this.recipeForm.reset();
	}
	
	addIngredient() {
		(<FormArray>this.recipeForm.get('ingredients')).push(
			new FormGroup({
				'name': new FormControl(null, Validators.required),
			})
		);
	}	
}
