import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    authForm!: FormGroup;
    isLoginMode = true;
    isLoading = false;
    error: string = '';
    
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    }
    
    ngOnInit() {
        this.authForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
    
    onSubmit(authForm: FormGroup) {
        if (!authForm.valid) {
            return;
        }
        const email = this.authForm.get('email')?.value;
        const password = this.authForm.get('password')?.value;
        
        let authObservable: Observable<AuthResponseData>;
        
        this.isLoading = true;
        if (this.isLoginMode) {
            this.authService.login(email, password);
        } else {
            this.authService.signup(email, password);
        }
        
        // authObservable.subscribe(responseData => {
        //     console.log(responseData);
        //     this.isLoading = false;
        //     this.router.navigate(['/brewery']);
        //     authForm.reset();
        // }, errorMessage => {
        //     console.log(errorMessage);
        //     this.error = errorMessage;
        //     this.isLoading = false;
        // });
    }
}
