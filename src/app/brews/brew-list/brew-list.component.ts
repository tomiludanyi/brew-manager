import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { combineLatest, forkJoin, Subject, takeUntil } from "rxjs";
import { Ingredient } from "../../ingredients/ingredient.model";
import { IngredientService } from "../../ingredients/ingredient.service";
import { RecipeService } from "../../recipes/recipe.service";
import { QueryParamService } from "../../shared/query-param.service";
import { Brew } from "../brew.model";
import { BrewService } from "../brew.service";

@Component({
    selector: 'app-brew-list',
    templateUrl: './brew-list.component.html',
    styleUrls: ['./brew-list.component.css']
})
export class BrewListComponent implements OnInit, OnDestroy {
    
    brews$ = this.brewService.brews$;
    brews: Brew[] = [];
    ingredients$ = this.ingredientService.ingredients$;
    ingredients: Ingredient[] = [];
    @Output() brewsOutOfStockIDs: number[] = [];
    
    private destroy$ = new Subject<void>();
    
    protected readonly Math = Math;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    itemsPerPageOptions = [10, 20, 30];
    defaultSortField: string = 'id';
    asc = true;
    
    listColumns = [
        { field: 'id', label: 'Brew ID' },
        { field: 'recipeName', label: 'Recipe Name', isEditable: true },
        { field: 'startDate', label: 'Start Date', isEditable: true }
    ];
    
    constructor(private router: Router, 
                private brewService: BrewService, 
                private recipeService: RecipeService, 
                private ingredientService: IngredientService,
                private queryParamService: QueryParamService) {
    }
    
    ngOnInit() {
        
        this.queryParamService.getQueryParam('page')
            .pipe(takeUntil(this.destroy$))
            .subscribe((page) => {
                if (page) {
                    this.currentPage = +page;
                }
            });
        
        combineLatest([this.brews$, this.ingredients$]).subscribe(([brews, ingredients]) => {
            this.brews = brews;
            this.ingredients = ingredients;
        });
        
        this.checkRoute();
        
        this.router.events.subscribe(() => {
            this.checkRoute();
        });
    }
    
    onSort(field: string) {
        if (field === this.defaultSortField) {
            this.asc = !this.asc;
        } else {
            this.asc = true;
            this.defaultSortField = field;
        }
        this.loadBrewsSortedBy(field, this.asc);
    }
    
    loadBrewsSortedBy(field: string, isAscending: boolean) {
        const order = isAscending ? 'asc' : 'desc';
        this.brews$ = this.brewService.getBrewsSortedBy(field, order);
    }
    
    private checkRoute() {
        const currentRoute = this.router.url;
        this.brewService.setBrew(!currentRoute.includes('/brewery'));
        this.brewService.setRedHighlight(currentRoute.includes('/brewery'));
    }
    
    checkIngredients() {
        const observables = this.brews.map(brew => this.recipeService.getRecipeByName(brew.recipeName));
        
        this.brews.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        
        forkJoin(observables).subscribe(recipes => {
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                const brew = this.brews[i];
                
                if (recipe) {
                    for (let j = 0; j < recipe.ingredients.length; j++) {
                        const recipeIngredient = recipe.ingredients[j];
                        const ingredientStock = this.ingredients[recipeIngredient.id - 1]?.stock;
                        
                        if (
                            recipeIngredient.amount === undefined ||
                            ingredientStock === undefined ||
                            recipeIngredient.amount > ingredientStock
                        ) {
                            this.brewsOutOfStockIDs.push(brew.id);
                        }
                        this.ingredients[recipeIngredient.id - 1].stock! -= recipeIngredient.amount!;
                    }
                } else {
                    console.warn(`Recipe not found for brew with name: ${brew.recipeName}`);
                }
            }
        });
    }
    
    onPageChanged(newPage: number) {
        this.queryParamService.setQueryParam('page', newPage.toString());
    }
    
    onItemsPerPageChange(itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
