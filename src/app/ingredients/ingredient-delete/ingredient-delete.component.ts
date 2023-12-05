import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, of, switchMap } from "rxjs";
import { Ingredient } from "../ingredient.model";
import { IngredientService } from "../ingredient.service";

@Component({
    selector: 'app-ingredient-delete',
    templateUrl: './ingredient-delete.component.html',
    styleUrls: ['./ingredient-delete.component.css']
})
export class IngredientDeleteComponent implements OnInit {
    id!: number;
    ingredientToDelete?: Ingredient;
    @Output() isDeleteMode = new EventEmitter<boolean>();
    @Output() idToDelete = new EventEmitter<number>();
    @Input() itemIdToDelete!: number;
    
    constructor(private route: ActivatedRoute, private router: Router, private ingredientService: IngredientService) {
    }
    
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = +params['id'];
        });
        this.ingredientService.getIngredient(this.itemIdToDelete).subscribe(ingredient => {
            if (ingredient) {
                this.ingredientToDelete = ingredient;
            }
        });
    }
    
    onConfirm() {
        this.ingredientService.deleteIngredient(this.itemIdToDelete).pipe(switchMap(() => {
                return this.router.navigate(['ingredient-list']);
            }),
            catchError(error => {
                    console.error('Error deleting ingredient:', error);
                    return of(null);
                })
        ).subscribe(() => {
            this.isDeleteMode.emit(false);
        });
    }
    
    onCancel() {
        this.router.navigate(['ingredient-list']).then(r => r);
        this.isDeleteMode.emit(false);
        this.idToDelete.emit(NaN);
    }
}
