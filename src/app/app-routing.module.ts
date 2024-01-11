import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { UnauthorizedComponent } from "./auth/unauthorized/unauthorized.component";
import { BrewListComponent } from "./brews/brew-list/brew-list.component";
import { IngredientDeleteComponent } from "./ingredients/ingredient-delete/ingredient-delete.component";
import { IngredientEditComponent } from "./ingredients/ingredient-edit/ingredient-edit.component";
import { IngredientHandlerComponent } from "./ingredients/ingredient-handler/ingredient-handler.component";
import { IngredientListComponent } from "./ingredients/ingredient-list/ingredient-list.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";

const routes: Routes = [
    { path: 'ingredient-edit', component: IngredientEditComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-edit/:id', component: IngredientEditComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-list', component: IngredientListComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-handler', component: IngredientHandlerComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-delete', component: IngredientDeleteComponent, canActivate: [AuthGuard] },
    { path: 'ingredient-delete/:id', component: IngredientDeleteComponent, canActivate: [AuthGuard] },
    { path: 'recipe-edit', component: RecipeEditComponent, canActivate: [AuthGuard] },
    { path: 'recipe-edit/:id', component: RecipeEditComponent, canActivate: [AuthGuard] },
    { path: 'recipe-list', component: RecipeListComponent, canActivate: [AuthGuard] },
    { path: 'recipe-list/:id', component: RecipeListComponent, canActivate: [AuthGuard] },
    { path: 'brewery', component: BrewListComponent, canActivate: [AuthGuard] },
    { path: 'admin/login', component: AuthComponent },
    { path: 'unauthorized', component: UnauthorizedComponent }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
