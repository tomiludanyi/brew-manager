import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule, RouterOutlet, Routes } from "@angular/router";

import { AppComponent } from './app.component';
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { IngredientEditComponent } from "./ingredients/ingredient-edit/ingredient-edit.component";
import { IngredientListComponent } from './ingredients/ingredient-list/ingredient-list.component';
import { IngredientDeleteComponent } from './ingredients/ingredient-delete/ingredient-delete.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { HeaderComponent } from './header/header.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { ItemListComponent } from './shared/item-list/item-list/item-list.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { ListControlsComponent } from './shared/list-controls/list-controls.component';
import { RecipeDeleteComponent } from './recipes/recipe-delete/recipe-delete.component';
import { IngredientHandlerComponent } from './ingredients/ingredient-handler/ingredient-handler.component';
import { BrewEditComponent } from './brews/brew-edit/brew-edit.component';
import { BrewListComponent } from './brews/brew-list/brew-list.component';

const routes: Routes = [
    { path: 'ingredient-edit', component: IngredientEditComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-edit/:id', component: IngredientEditComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-list', component: IngredientListComponent },
    { path: 'ingredient-handler', component: IngredientHandlerComponent },
    { path: 'ingredient-delete', component: IngredientDeleteComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-delete/:id', component: IngredientDeleteComponent, canActivate: [AuthGuard] },
    { path: 'recipe-edit', component: RecipeEditComponent, canActivate: [AuthGuard] },
    { path: 'recipe-edit/:id', component: RecipeEditComponent, canActivate: [AuthGuard] },
    { path: 'recipe-list', component: RecipeListComponent, canActivate: [AuthGuard] },
    { path: 'recipe-list/:id', component: RecipeListComponent, canActivate: [AuthGuard] },
    { path: 'brewery', component: BrewListComponent, canActivate: [AuthGuard] },
    { path: 'admin/login', component: AuthComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        IngredientEditComponent,
        IngredientListComponent,
        IngredientDeleteComponent,
        PaginationComponent,
        HeaderComponent,
        RecipeEditComponent,
        ItemListComponent,
        RecipeListComponent,
        ListControlsComponent,
        RecipeDeleteComponent,
        IngredientHandlerComponent,
        BrewEditComponent,
        BrewListComponent,
        AuthComponent
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
