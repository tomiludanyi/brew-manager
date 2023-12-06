import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil, tap } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
	selector: 'app-ingredient-delete',
	templateUrl: './ingredient-delete.component.html',
	styleUrls: ['./ingredient-delete.component.css']
})
export class IngredientDeleteComponent implements OnInit, OnDestroy {
	id!: number;
	ingredientToDelete?: Ingredient;
	@Output() isDeleteMode = new EventEmitter<boolean>();
	@Output() idToDelete = new EventEmitter<number>();
	@Input() itemIdToDelete!: number;
	
	private destroy$ = new Subject<void>();
	
	constructor(private route: ActivatedRoute, private router: Router, private ingredientService: IngredientService) {
	}
	
	ngOnInit(): void {
		this.route.params
			.pipe(takeUntil(this.destroy$))
			.subscribe(params => {
				this.id = +params['id'];
			});
		
		this.ingredientService.getIngredient(this.itemIdToDelete)
			.pipe(takeUntil(this.destroy$))
			.subscribe(ingredient => {
				if (ingredient) {
					this.ingredientToDelete = ingredient;
				}
			});
	}
	
	onConfirm() {
		this.ingredientService.deleteIngredient(this.itemIdToDelete)
			.pipe(
				tap(() => this.router.navigate(['ingredient-list'])),
				takeUntil(this.destroy$)
			)
			.subscribe({
				next: () => {
					this.isDeleteMode.emit(false);
				}
			});
	}
	
	
	onCancel() {
		this.router.navigate(['ingredient-list']).then(r => r);
		this.isDeleteMode.emit(false);
		this.idToDelete.emit(NaN);
	}
	
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
