import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { QueryParamService } from "../../shared/query-param.service";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit {
    @Input() confirmed?: boolean;
    ingredients$!: Observable<Ingredient[]>;
    ingredients: Ingredient[] = [];
    filterText: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
    defaultSortField: string = 'id';
    asc: boolean = true;
    
    constructor(private ingredientService: IngredientService, private router: Router, private queryParamService: QueryParamService) {
    }
    
    ngOnInit(): void {
        this.queryParamService.getQueryParam('page').subscribe((page) => {
            if (page) {
                this.currentPage = +page;
            }
            this.loadIngredientsSortedBy(this.defaultSortField, this.asc);
        });
        this.ingredients$ = this.ingredientService.getIngredients();
    }
    
    filterIngredients() {
        this.ingredients$ = this.ingredientService.getIngredients().pipe(
            map(ingredients => {
                return ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(this.filterText.toLowerCase()));
            })
        );
    }
    
    loadIngredients() {
        this.ingredientService.getIngredients().subscribe((data: Ingredient[]) => {
            this.ingredients = data;
            this.totalPages = Math.ceil(this.ingredients.length / this.itemsPerPage);
        });
    }
    
    loadIngredientsSortedBy(field: string, isAscending: boolean) {
        const order = isAscending ? 'asc' : 'desc';
        this.ingredientService.getIngredientsSortedBy(field, order).subscribe((data: Ingredient[]) => {
            this.ingredients = data;
            this.totalPages = Math.ceil(this.ingredients.length / this.itemsPerPage);
        });
    }
    
    onPageChanged(newPage: number) {
        this.queryParamService.setQueryParam('page', newPage.toString());
    }
    
    onFilterChange() {
        this.currentPage = 1;
        this.ingredients$ = this.ingredientService.getFilteredIngredients(this.filterText);
        this.ingredients$.subscribe((data: Ingredient[]) => {
            this.ingredients = data;
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
        this.loadIngredientsSortedBy(this.defaultSortField, this.asc);
    }
    
    onSort(field: string) {
        if (field === this.defaultSortField) {
            this.asc = !this.asc;
        } else {
            this.asc = true;
            this.defaultSortField = field;
        }
        this.loadIngredientsSortedBy(field, this.asc);
    }
}
