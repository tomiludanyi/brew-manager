import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, switchMap, takeUntil } from "rxjs";
import { BrewService } from "../../brews/brew.service";
import { QueryParamService } from "../../shared/query-param.service";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
	@Input() confirmed?: boolean;
	@Input() isDelete = false;
	
	protected readonly Math = Math;
	
	filteredRecipes$ = this.recipeService.filteredRecipes$;
	recipes: Recipe[] = [];
	
	private destroy$ = new Subject<void>();
	
	currentPage: number = 1;
	itemsPerPage: number = 10;
	defaultSortField: string = 'name';
	asc = true;
	isEditMode = false;
	editedItem: Recipe = {} as Recipe;
	idToDelete!: number;
	filterText = new FormControl('');
	
	itemsPerPageOptions = [10, 20, 30];
	
	listColumns = [
		{ field: 'id', label: 'ID' },
		{ field: 'name', label: 'Name' }
	];
	
	
	constructor(private recipeService: RecipeService,
	            private queryParamService: QueryParamService,
	            private cdr: ChangeDetectorRef,
                private brewService: BrewService,
                private router: Router) {
	}
	
	ngOnInit(): void {
		this.queryParamService.getQueryParam('page')
			.pipe(takeUntil(this.destroy$))
			.subscribe((page) => {
				if (page) {
					this.currentPage = +page;
				}
				this.loadRecipesSortedBy(this.defaultSortField, this.asc);
			});
	}
	
	loadRecipesSortedBy(field: string, isAscending: boolean) {
		const order = isAscending ? 'asc' : 'desc';
		this.filteredRecipes$ = this.recipeService.getRecipesSortedBy(field, order);
	}
	
	onPageChanged(newPage: number) {
		this.queryParamService.setQueryParam('page', newPage.toString());
	}
	onFilterChange() {
		this.currentPage = 1;
		this.filteredRecipes$ = this.recipeService.getFilteredRecipes(this.filterText.value!);
	}
	
	onEditItem(recipe: Recipe) {
		this.isEditMode = true;
		this.editedItem = recipe;
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
		this.editedItem = {} as Recipe;
		this.cdr.markForCheck();
	}
	
	onSaveEditing(editedItem: Recipe) {
		this.recipeService.updateRecipe(editedItem)
			.pipe(
				switchMap(() => this.filteredRecipes$),
				takeUntil(this.destroy$)
			)
			.subscribe(
				(recipes: Recipe[]) => {
					this.recipes = recipes;
					this.isEditMode = false;
					this.editedItem = {} as Recipe;
					this.cdr.detectChanges();
				}
			);
	}
	
	onItemsPerPageChange(itemsPerPage: number) {
		this.itemsPerPage = itemsPerPage;
		this.currentPage = 1;
	}
	
	onSort(field: string) {
		if (field === this.defaultSortField) {
			this.asc = !this.asc;
		} else {
			this.asc = true;
			this.defaultSortField = field;
		}
		this.loadRecipesSortedBy(field, this.asc);
	}
    
    onBrewRecipe(recipe: Recipe) {
        this.brewService.setSelectedRecipe(recipe);
        this.router.navigate(['/brewery']).then(r => r);
    }
	
	deleteMode($event: boolean) {
		this.isDelete = false;
	}
	
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
