import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-ingredient-edit',
    templateUrl: './ingredient-edit.component.html',
    styleUrls: ['./ingredient-edit.component.css']
})
export class IngredientEditComponent implements OnInit {
    ingredientForm!: FormGroup;
    
    ngOnInit(): void {
        this.initForm();
    }
    
    private initForm() {
        let ingredientName = '';
        
        this.ingredientForm = new FormGroup({
            'name': new FormControl(ingredientName, Validators.required)
        });
    }
}
