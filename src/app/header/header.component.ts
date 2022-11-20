import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  filterTxt = '';
  sortType = '1';
  filterType = 'All';
  alphabet = [
    {value: 'All', viewValue: 'All'},
    {value: 'A', viewValue: 'A'},
    {value: 'B', viewValue: 'B'},
    {value: 'C', viewValue: 'C'},
    {value: 'D', viewValue: 'D'},
    {value: 'E', viewValue: 'E'},
    {value: 'F', viewValue: 'F'},
    {value: 'G', viewValue: 'G'},
    {value: 'H', viewValue: 'H'},
    {value: 'I', viewValue: 'I'},
    {value: 'J', viewValue: 'J'},
    {value: 'K', viewValue: 'K'},
    {value: 'L', viewValue: 'L'},
    {value: 'M', viewValue: 'M'},
    {value: 'N', viewValue: 'N'},
    {value: 'O', viewValue: 'O'},
    {value: 'P', viewValue: 'P'},
    {value: 'Q', viewValue: 'Q'},
    {value: 'R', viewValue: 'R'},
    {value: 'S', viewValue: 'S'},
    {value: 'T', viewValue: 'T'},
    {value: 'U', viewValue: 'U'},
    {value: 'V', viewValue: 'V'},
    {value: 'W', viewValue: 'W'},
    {value: 'X', viewValue: 'X'},
    {value: 'Y', viewValue: 'Y'},
    {value: 'Z', viewValue: 'Z'}
  ];

  @Output() filterTxtEmitter = new EventEmitter <{ text: string , sort: string , filter: string}> ();

  searchWord() {
    this.filterTxtEmitter.emit({text: this.filterTxt , sort: this.sortType , filter: this.filterType});
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout();
  }

}
