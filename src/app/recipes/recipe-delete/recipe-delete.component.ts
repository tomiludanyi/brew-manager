import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil, tap } from "rxjs";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
    selector: 'app-recipe-delete',
    templateUrl: './recipe-delete.component.html',
    styleUrls: ['./recipe-delete.component.css']
})
export class RecipeDeleteComponent implements OnInit, OnDestroy {
    id!: number;
    recipeToDelete?: Recipe;
    @Output() isDeleteMode = new EventEmitter<boolean>();
    @Output() idToDelete = new EventEmitter<number>();
    @Input() itemIdToDelete!: number;
    
    private destroy$ = new Subject<void>();
    
    constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) {
    }
    
    ngOnInit(): void {
        this.route.params
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.id = +params['id'];
            });
        
        this.recipeService.getRecipe(this.itemIdToDelete)
            .pipe(takeUntil(this.destroy$))
            .subscribe(recipe => {
                if (recipe) {
                    this.recipeToDelete = recipe;
                }
            });
    }
    
    onConfirm() {
        this.recipeService.deleteRecipe(this.itemIdToDelete)
            .pipe(
                tap(() => this.router.navigate(['recipe-list'])),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: () => {
                    this.isDeleteMode.emit(false);
                }
            });
    }
    
    onCancel() {
        this.router.navigate(['recipe-list']).then(r => r);
        this.isDeleteMode.emit(false);
        this.idToDelete.emit(NaN);
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
