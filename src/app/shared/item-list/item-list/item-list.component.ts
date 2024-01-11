import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { BrewService } from "../../../brews/brew.service";

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
    @Input() columns: { field: string; label: string; isEditable?: boolean }[] = [];
    @Input() items: any[] = [];
    @Input() currentPage: number = 1;
    @Input() itemsPerPage: number = 10;
    @Input() defaultSortField: string = '';
    @Input() asc: boolean = true;
    @Input() isEditMode: boolean = false;
    @Input() editedItem: any = {};
    @Input() IDs: number [] = [];
    @Input() isAdmin: boolean = true;
    @Output() sort = new EventEmitter<string>();
    @Output() pageChanged = new EventEmitter<number>();
    @Output() editItem = new EventEmitter<any>();
    @Output() deleteItem = new EventEmitter<number>();
    @Output() saveEditing = new EventEmitter<any>();
    @Output() cancelEditing = new EventEmitter<void>();
    @Output() brew = new EventEmitter<any>();
    
    isBrew = true;
    isRedHighlight = false;
    isBrewPage = false;
    isIngredientPage = false;
    
    constructor(private brewService: BrewService, private router: Router) {
    }
    
    ngOnInit(): void {
        this.checkRoute();
        this.brewService.isBrew$.subscribe((isVisible) => {
            this.isBrew = isVisible;
        });
        this.brewService.isRedHighlightVisible$.subscribe((isVisible) => {
            this.isRedHighlight = isVisible;
        })
        this.router.events.subscribe(() => {
            this.checkRoute();
        });
    }
    
    onSort(field: string) {
        this.sort.emit(field);
    }
    
    onSaveEditing(item: any) {
        this.saveEditing.emit(item);
    }
    
    onCancelEditing() {
        this.cancelEditing.emit();
    }
    
    onEditItem(item: any) {
        this.editItem.emit(item);
    }
    
    onDeleteItem(id: number) {
        this.deleteItem.emit(id);
    }
    
    onBrew(item: any) {
        this.brew.emit(item);
    }
    
    checkRoute() {
        if (this.router.url.includes('/brewery')) {
            this.isBrewPage = true;
        } else if (this.router.url.includes('/ingredient-list')) {
            this.isIngredientPage = true;
        }
    }
}
