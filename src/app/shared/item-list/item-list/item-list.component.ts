import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
	
	@Output() sort = new EventEmitter<string>();
	@Output() pageChanged = new EventEmitter<number>();
	@Output() editItem = new EventEmitter<any>();
	@Output() deleteItem = new EventEmitter<number>();
	@Output() saveEditing = new EventEmitter<any>();
	@Output() cancelEditing = new EventEmitter<void>();
    @Output() brew = new EventEmitter<any>();
    
    isBrewButton = true;
    isRedHighlight = false;
    
    constructor(private brewService: BrewService) {}
    
    ngOnInit(): void {
        this.brewService.isBrewButtonVisible$.subscribe((isVisible) => {
            this.isBrewButton = isVisible;
        });
        this.brewService.isRedHighlightVisible$.subscribe((isVisible) => {
            this.isRedHighlight = isVisible;
        })
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
}
