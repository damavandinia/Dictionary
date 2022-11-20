import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthResponseData, AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = "Login";
  isLoginMode = true;

  showModalProgress = false;

  email = new FormControl('', [Validators.required , Validators.email]);
  password = new FormControl('', [Validators.required , Validators.minLength(6)]);

  constructor(private authService: AuthService ,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {}

  getEmailInputError(){

    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPassInputError(){
    if (this.email.hasError('required')) {
      return 'You must enter a password';
    }

    return this.email.hasError('minLength') ? 'Enter at least 6 characters' : '';
  }

  handleLoginForm(form: NgForm) {

    if (!form.valid){
      return;
    }

    this.showModalProgress = true;

    const values = form.value;

    const email = values.email;
    const password = values.password;

    let authObs: Observable<AuthResponseData>

    if (this.isLoginMode){
      authObs = this.authService.login(email , password);

    }else {
      authObs = this.authService.signup(email , password);
    }

    authObs.subscribe(resData => {
      this.showModalProgress = false;
      console.log(resData);
      this.router.navigate(['/']);

    }, errorMessage => {
      this.showModalProgress = false;
      this._snackBar.open(errorMessage, null, {"duration": 4000});
    });
  }

  googleLogin(){
    this.showModalProgress = true;

    this.authService.loginWithGoogle().then(r => {
      this.showModalProgress = false;
      console.log(r);
      this.router.navigate(['/']);

    }, errorMessage =>{
      this.showModalProgress = false;
      this._snackBar.open(errorMessage, null, {"duration": 4000});
    });
  }

  switchMode(){

    if (this.isLoginMode){
      document.getElementById("loginTitle").style.transform = 'rotateX(90deg)';
      timer(300).subscribe(x => {
        this.title = 'Sign Up'
        document.getElementById("loginTitle").style.transform = 'rotateX(0)';
      })

    }else {
      document.getElementById("loginTitle").style.transform = 'rotateX(90deg)';
      timer(300).subscribe(x => {
        this.title = 'Login'
        document.getElementById("loginTitle").style.transform = 'rotateX(0)';
      })
    }

    this.isLoginMode = !this.isLoginMode;
  }

}
