export class Brew {
    constructor(public id: number, public recipeId: number | null, public startDate?: Date, public status?: string) {
    }
}
