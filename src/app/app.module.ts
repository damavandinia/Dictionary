import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { WordItemComponent } from './word-item/word-item.component';
import { FilterPipe } from './filter.pipe';
import { ModalComponent } from './modal/modal.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WordItemComponent,
    FilterPipe,
    ModalComponent
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
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
