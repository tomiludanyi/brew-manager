import { Recipe } from "../recipes/recipe.model";

export class Brew {
    constructor(public id: number, public recipe: Recipe) {
    }
}
