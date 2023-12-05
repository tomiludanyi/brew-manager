import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
    @Input() currentPage!: number;
    @Input() totalPages!: number;
    @Output() pageChanged = new EventEmitter<number>();
    
    get visiblePages(): number[] {
        const pages = [];
        const maxPages = 3;
        let start = Math.max(this.currentPage - maxPages, 1);
        let end = Math.min(this.currentPage + maxPages, this.totalPages);
        
        while (start <= end) {
            pages.push(start);
            start++;
        }
        return pages;
    }
    
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.pageChanged.emit(page);
        }
    }
    
}
