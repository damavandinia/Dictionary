import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})
export class LangComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getCurrentRoute() {
    return this.router.url;
  }

  getCurrentLanguage(){
    return localStorage.getItem('lang').toString().toUpperCase();
  }
}
