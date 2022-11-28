import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  toggleDarkMode = new Subject<boolean>();

  constructor() { }
}
