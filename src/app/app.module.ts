import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { WordItemComponent } from './word-item/word-item.component';
import { FilterPipe } from './filter.pipe';
import { ModalComponent } from './modal/modal.component';
import { LoginComponent } from './login/login.component';
import {AppRoutingModule} from "./app.routing.module";
import {DictionaryComponent} from "./dictionary/dictionary.component";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCazdiRoo9M2hfSRaSGgDZ3hghtYeRrM4M",
  authDomain: "dictionary-90a42.firebaseapp.com",
  databaseURL: "https://dictionary-90a42-default-rtdb.firebaseio.com",
  projectId: "dictionary-90a42",
  storageBucket: "dictionary-90a42.appspot.com",
  messagingSenderId: "569119452129",
  appId: "1:569119452129:web:71afc98e763074d40440a0"
}

@NgModule({
  declarations: [
    AppComponent,
    DictionaryComponent,
    HeaderComponent,
    WordItemComponent,
    FilterPipe,
    ModalComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
