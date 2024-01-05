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
    loginForm!: FormGroup;
    isLoginMode = true;
    isLoggedIn = false;
    isLoading = false;
    error: string = '';
    
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    }
    
    ngOnInit() {
        this.loginForm = this.fb.group({
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
        const email = authForm.value.email;
        const password = authForm.value.password;
        
        let authObservable: Observable<AuthResponseData>;
        
        this.isLoading = true;
        if (this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signup(email, password);
        }
        
        authObservable.subscribe(responseData => {
            console.log(responseData);
            this.isLoading = false;
            this.router.navigate(['/brewery']);
        }, errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.isLoading = false;
        });
        
        authForm.reset();
    }
}
