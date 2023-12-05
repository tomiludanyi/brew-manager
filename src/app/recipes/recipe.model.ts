import { Ingredient } from "../ingredients/ingredient.model";

export class Recipe {
	constructor(
		public id: number | null,
		public name: string,
		public ingredients: Ingredient[]
	) {}
}
