import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IngredientEditComponent } from "./ingredients/ingredient-edit/ingredient-edit.component";

@NgModule({
    declarations: [
        AppComponent,
        IngredientEditComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
