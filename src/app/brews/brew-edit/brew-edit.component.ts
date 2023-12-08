import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../recipes/recipe.model";
import { BrewService } from "../brew.service";

@Component({
  selector: 'app-brew-edit',
  templateUrl: './brew-edit.component.html',
  styleUrls: ['./brew-edit.component.css']
})
export class BrewEditComponent implements OnInit{
    selectedRecipe: Recipe | null = null;
    
    constructor(private brewService: BrewService) { }
    
    ngOnInit(): void {
        this.brewService.selectedRecipe$.subscribe(recipe => {
            this.selectedRecipe = recipe;
        });
    }

}
