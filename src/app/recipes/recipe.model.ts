import { Ingredient } from "../ingredients/ingredient.model";

export class Recipe {
	constructor(public name: string,
	            public ingredients: Ingredient[]) {}
}
