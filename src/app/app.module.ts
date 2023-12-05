import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule, RouterOutlet, Routes } from "@angular/router";

import { AppComponent } from './app.component';
import { IngredientEditComponent } from "./ingredients/ingredient-edit/ingredient-edit.component";
import { IngredientListComponent } from './ingredients/ingredient-list/ingredient-list.component';
import { IngredientDeleteComponent } from './ingredients/ingredient-delete/ingredient-delete.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
    { path: 'ingredient-edit', component: IngredientEditComponent },
    { path: 'ingredient-edit/:id', component: IngredientEditComponent },
    { path: 'ingredient-list', component: IngredientListComponent },
    { path: 'ingredient-delete', component: IngredientDeleteComponent },
    { path: 'ingredient-delete/:id', component: IngredientDeleteComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        IngredientEditComponent,
        IngredientListComponent,
        IngredientDeleteComponent,
        PaginationComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterLink,
        RouterOutlet,
        [RouterModule.forRoot(routes)],
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
