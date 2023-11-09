import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { QueryParamService } from "../../shared/query-param.service";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit, DoCheck {
    @Input() confirmed?: boolean;
    ingredients$!: Observable<Ingredient[]>;
    ingredients: Ingredient[] = [];
    filterText: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
    column: string = 'id';
    isAscending: boolean = true;
    
    constructor(private ingredientService: IngredientService, private router: Router, private queryParamService: QueryParamService) {
    }
    
    ngOnInit(): void {
        this.queryParamService.getQueryParam('page').subscribe((page) => {
            if (page) {
                this.currentPage = +page;
            }
            this.loadIngredients();
        });
        this.ingredients$ = this.ingredientService.getIngredients();
    }
    
    loadIngredients() {
        this.ingredientService.getIngredients().subscribe((data: Ingredient[]) => {
            this.ingredients = data;
            this.totalPages = Math.ceil(this.ingredients.length / this.itemsPerPage);
        });
    }
    
    sortIngredientsBy(column: string, isAscending: boolean) {
        this.ingredients.sort((a, b) => {
            const x = column === 'id' ? Number(a.id) : a.name.toString().toLowerCase();
            const y = column === 'id' ? Number(b.id) : b.name.toString().toLowerCase();
            
            if (x < y) {
                return isAscending ? -1 : 1;
            } else if (x > y) {
                return isAscending ? 1 : -1;
            } else {
                return 0;
            }
        });
    }
    
    onPageChanged(newPage: number) {
        this.queryParamService.setQueryParam('page', newPage.toString());
    }
    
    onFilterChange() {
        this.currentPage = 1;
        this.ingredients$ = this.ingredientService.getFilteredIngredients(this.filterText);
        this.ingredients$.subscribe((ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
            this.totalPages = Math.ceil(this.ingredients.length / this.itemsPerPage);
        });
    }
    
    onEditItem(ingredient: Ingredient) {
        this.router.navigate(['ingredient-edit', ingredient.id]).then(r => r);
    }
    
    onDeleteItem(ingredient: Ingredient) {
        this.router.navigate(['ingredient-delete', ingredient.id]).then(r => r);
    }
    
    onItemsPerPageChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.itemsPerPage = +value;
        this.currentPage = 1;
        this.loadIngredients();
    }
    
    onSort(column: string) {
        if (column === this.column) {
            this.isAscending = !this.isAscending;
        } else {
            this.isAscending = true;
            this.column = column;
        }
        this.sortIngredientsBy(column, this.isAscending);
    }
    
    ngDoCheck(): void {
        this.sortIngredientsBy(this.column, this.isAscending);
    }
}
