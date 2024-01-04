import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    loginForm!: FormGroup;
    
    isLoggedIn = false;
    
    constructor(private fb: FormBuilder) {
    }
    
    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    
    onSubmit() {
        this.isLoggedIn = true;
    }
}
