import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { catchError, Observable, of, Subscription, switchMap } from "rxjs";
import { QueryParamService } from "../../shared/query-param.service";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit, OnDestroy {
    @Input() confirmed?: boolean;
    ingredients$!: Observable<Ingredient[]>;
    ingredients: Ingredient[] = [];
    subscription?: Subscription;
    filterText: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;
    defaultSortField: string = 'name';
    asc: boolean = true;
    editMode = false;
    editedItem: Ingredient = {} as Ingredient;
    
    constructor(private ingredientService: IngredientService, private router: Router, private queryParamService: QueryParamService, private cdr: ChangeDetectorRef) {
    }
    
    ngOnInit(): void {
        this.queryParamService.getQueryParam('page').subscribe((page) => {
            if (page) {
                this.currentPage = +page;
            }
            this.loadIngredientsSortedBy(this.defaultSortField, this.asc);
        });
        this.subscription = this.ingredientService.refreshIngredients
            .subscribe(
                (ingredients => {
                    this.ingredients = ingredients;
                    this.loadIngredientsSortedBy(this.defaultSortField, this.asc);
                })
            )
        this.ingredients$ = this.ingredientService.getIngredients();
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
        this.editMode = true;
        this.editedItem = ingredient;
    }
    
    onDeleteItem(ingredient: Ingredient) {
        this.router.navigate(['ingredient-delete', ingredient.id]).then(r => r);
    }
    
    onCancelEditing() {
        this.editMode = false;
        this.editedItem = {} as Ingredient;
        this.cdr.markForCheck();
    }
    
    onSaveEditing(editedItem: Ingredient) {
        this.ingredientService.updateIngredient(editedItem).pipe(
            switchMap(() => this.ingredientService.getIngredients()),
            catchError(error => {
                console.error('Error editing ingredient:', error);
                return of([]);
            })
        ).subscribe((ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
            this.editMode = false;
            this.editedItem = {} as Ingredient;
            this.cdr.detectChanges();
        });
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
    
    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }    
}
