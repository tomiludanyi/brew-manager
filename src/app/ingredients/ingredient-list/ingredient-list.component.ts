import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {
    @Input() confirmed?: boolean;
    ingredients$!: Observable<Ingredient[]>;
    filterText: string = '';
    
    constructor(private ingredientService: IngredientService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.ingredients$ = this.ingredientService.getIngredients();
    }
    
    filterIngredients() {
        this.ingredients$ = this.ingredientService.getIngredients().pipe(
            map(ingredients => {
                return ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(this.filterText.toLowerCase()));
            })
        );
    }
    
    onEditItem(ingredient: Ingredient) {
        this.router.navigate(['ingredient-edit', ingredient.id]).then(r => r);
    }
    
    onDeleteItem(ingredient: Ingredient) {
        this.router.navigate(['ingredient-delete', ingredient.id]).then(r => r);
    }
}
