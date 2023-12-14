import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BrewService } from "../brew.service";

@Component({
  selector: 'app-brew-list',
  templateUrl: './brew-list.component.html',
  styleUrls: ['./brew-list.component.css']
})
export class BrewListComponent implements OnInit {
    
    brews$ = this.brewService.brews$;
    
    protected readonly Math = Math;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    defaultSortField: string = 'id';
    asc = true;
    
    listColumns = [
        { field: 'id', label: 'Brew ID' },
        { field: 'recipeId', label: 'Recipe ID', isEditable: true },
        { field: 'startDate', label: 'Start Date', isEditable: true }
    ];
    
    constructor(private router: Router, private brewService: BrewService) {
    }
    
    ngOnInit() {
        this.checkRoute();
        
        this.router.events.subscribe(() => {
            this.checkRoute();
        });
    }
    
    onSort(field: string) {
        if (field === this.defaultSortField) {
            this.asc = !this.asc;
        } else {
            this.asc = true;
            this.defaultSortField = field;
        }
        this.loadBrewsSortedBy(field, this.asc);
    }
    
    loadBrewsSortedBy(field: string, isAscending: boolean) {
        const order = isAscending ? 'asc' : 'desc';
        this.brews$ = this.brewService.getBrewsSortedBy(field, order);
    }
    
    private checkRoute() {
        const currentRoute = this.router.url;
        this.brewService.setBrewButton(!currentRoute.includes('/brewery'));
    }
}
