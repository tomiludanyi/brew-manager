import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-list-controls',
  templateUrl: './list-controls.component.html',
  styleUrls: ['./list-controls.component.scss']
})
export class ListControlsComponent {
  @Input() filterText: FormControl = new FormControl('');
  @Input() filterPlaceholder: string = 'Filter items';
  @Input() itemsPerPageOptions: number[] = [10, 20, 30];
  
  @Output() filterChange = new EventEmitter<string>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  
  onFilterChange() {
    this.filterChange.emit(this.filterText.value);
  }
  
  onItemsPerPageChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPerPageChange.emit(+value);
  }
}
