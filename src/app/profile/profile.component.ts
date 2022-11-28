import { Component, OnInit } from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {AuthResponseData, AuthService} from "../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {UserModel} from "../auth/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userEmail: string;
  userName: string;
  userAvatar: string;
  showProgress = false;
  isLoginWithGoogle = false;

  newPassword = new FormControl('', [Validators.required , Validators.minLength(6)]);
  usernameInput = new FormControl('', [Validators.required]);

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar) { }

  getPassInputError(){

    if (this.newPassword.hasError('required')) {
      return 'You must enter a password';
    }

    return this.newPassword.hasError('minLength') ? 'Enter at least 6 characters' : '';
  }

  ngOnInit(): void {

    const userData: {
      email: string,
      id: string,
      username: string,
      avatar: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData){
      return;
    }

    this.userEmail = userData.email;
    this.userName = userData.username;
    this.userAvatar = userData.avatar;

    let isGLogin = JSON.parse(localStorage.getItem('isGoogleLogin'));
    if (isGLogin){
      this.isLoginWithGoogle = isGLogin;
    }
  }

  handleProfileForm(form: NgForm) {

    if (!form.valid){return;}

    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date,
      username?: string,
      avatar?: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData){
      this._snackBar.open('An unknown error occurred!', null, {"duration": 4000});
      return;
    }

    userData.username = form.value.usernameInput;
    localStorage.setItem('userData' , JSON.stringify(userData));

    this._snackBar.open('The Username updated successfully.', null, {"duration": 4000});
  }

  handlePassForm(form: NgForm) {

    if (!form.valid){
      return;
    }

    this.showProgress = true;

    const newPassword = form.value.newPassword;

    this.authService.changePassword(newPassword).subscribe(resData => {
      this.showProgress = false;
      console.log(resData);
      this.authService.logout();

    }, errorMessage => {
      console.log(errorMessage);
      this.showProgress = false;
      this._snackBar.open(errorMessage.error.error.message, null, {"duration": 4000});
    });
  }
}
