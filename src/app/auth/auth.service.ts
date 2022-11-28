import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {UserModel} from "./user.model";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {user} from "@angular/fire/auth";


export interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: "root"})
export class AuthService{

  user = new BehaviorSubject<UserModel>(null);

  constructor(private http: HttpClient,
              private afAuth: AngularFireAuth,
              private router: Router) {}

  signup(email: string , password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCazdiRoo9M2hfSRaSGgDZ3hghtYeRrM4M' ,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(resData =>{
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, + resData.expiresIn);
    }));
  }

  login(email: string , password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCazdiRoo9M2hfSRaSGgDZ3hghtYeRrM4M' ,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(resData =>{
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, + resData.expiresIn);
    }));
  }

  async loginWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.handleAuthentication(credential.user.email, credential.user.uid, credential.user.refreshToken, 3600, credential.user.displayName, credential.user.photoURL);

    localStorage.setItem('isGoogleLogin', JSON.stringify(true));
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number, username?: string, avatar?: string){

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000 );
    const user = new UserModel(
      email,
      userId,
      token,
      expirationDate,
      username,
      avatar
    );
    this.user.next(user);

    localStorage.setItem('userData' , JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){

    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = "This email exist Already!";
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "This email does not exist!";
        break;
        case 'INVALID_PASSWORD':
        errorMessage = "Password is not correct!";
        break
    }
    return throwError(errorMessage);
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/login']);

    localStorage.removeItem('userData');
    localStorage.removeItem('isGoogleLogin');
  }

  autoLogin(){
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData){
      return;
    }

    const loadUser = new UserModel(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadUser.token){
      this.user.next(loadUser);
    }
  }

  changePassword(newPassword: string){

    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData){
      return;
    }

    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCazdiRoo9M2hfSRaSGgDZ3hghtYeRrM4M' ,
      {
        idToken: userData._token,
        password: newPassword,
        returnSecureToken: true
      }
    );
  }
}
