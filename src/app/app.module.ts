import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { AuthComponent } from "./auth/auth.component";
import { UnauthorizedComponent } from "./auth/unauthorized/unauthorized.component";
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
        AuthComponent,
        UnauthorizedComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterLink,
        RouterOutlet,
        FormsModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
