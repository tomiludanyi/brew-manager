import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { QueryParamService } from "../../shared/query-param.service";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientListComponent implements OnInit, OnDestroy {
    @Input() isDelete = false;
    
    protected readonly Math = Math;
    
    filteredIngredients$ = this.ingredientService.filteredIngredients$;
    private destroy$ = new Subject<void>();
    
    ingredients: Ingredient[] = [];
    
    currentPage: number = 1;
    itemsPerPage: number = 10;
    defaultSortField: string = 'name';
    asc = true;
    isEditMode = false;
    editedItem: Ingredient = {} as Ingredient;
    idToDelete!: number;
    filterText = new FormControl('');
    isAdmin: any;
    
    itemsPerPageOptions = [10, 20, 30];
    
    listColumns = [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Name', isEditable: true },
        { field: 'stock', label: 'Stock', isEditable: true },
        { field: 'unit', label: 'Unit' }
    ];
    
    constructor(private ingredientService: IngredientService,
                private router: Router,
                private queryParamService: QueryParamService,
                private cdr: ChangeDetectorRef,
                private authService: AuthService) {
    }
    
    ngOnInit(): void {
        this.queryParamService.getQueryParam('page')
            .pipe(takeUntil(this.destroy$))
            .subscribe((page) => {
                if (page) {
                    this.currentPage = +page;
                }
                this.loadIngredientsSortedBy(this.defaultSortField, this.asc);
            });
        if (this.authService.getUser().isAdmin) {
            this.isAdmin = true;
        }
    }
    
    
    loadIngredientsSortedBy(field: string, isAscending: boolean) {
        const order = isAscending ? 'asc' : 'desc';
        this.filteredIngredients$ = this.ingredientService.getIngredientsSortedBy(field, order);
    }
    
    onPageChanged(newPage: number) {
        this.queryParamService.setQueryParam('page', newPage.toString());
    }
    
    onFilterChange() {
        this.currentPage = 1;
        this.filteredIngredients$ = this.ingredientService.getFilteredIngredients(this.filterText.value!);
    }
    
    onEditItem(ingredient: Ingredient) {
        this.isEditMode = true;
        this.editedItem = ingredient;
    }
    
    onDeleteItem(id: number) {
        this.isDelete = true;
        this.idToDelete = id;
    }
    
    onCancelDelete() {
        this.idToDelete = NaN;
    }
    
    onCancelEditing() {
        this.isEditMode = false;
        this.editedItem = {} as Ingredient;
        this.cdr.markForCheck();
    }
    
    onSaveEditing(editedItem: Ingredient) {
        this.ingredientService.updateIngredient(editedItem)
            .pipe(
                switchMap(() => this.filteredIngredients$),
                takeUntil(this.destroy$)
            )
            .subscribe((ingredients: Ingredient[]) => {
                this.ingredients = ingredients;
                this.isEditMode = false;
                this.editedItem = {} as Ingredient;
                this.cdr.detectChanges();
            });
    }
    
    onItemsPerPageChange(itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
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
    
    deleteMode($event: boolean) {
        this.isDelete = false;
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
