import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Word} from "../word-item/word.model";
import {WordListService} from "../word-list.service";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  animations: [
    trigger('modal', [
      state('show', style({
        opacity: 1
      })),
      transition('void => *' , [
        style({
          opacity: 0
        }),
        animate(200)
      ]),
      transition('* => void' , [
        animate(200 , style({
          opacity: 0
        }))
      ])
    ]),
    trigger('listAnim', [
      state('show', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *' , [
        style({
          opacity: 0,
          transform: 'translateX(-10px)'
        }),
        animate(150)
      ]),
      transition('* => void' , [
        animate(150 , style({
          transform: 'translateX(10px)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class DictionaryComponent implements OnInit, OnDestroy {

  private wordChangedSub: Subscription;
  private openEditModal: Subscription;
  private serverError: Subscription;
  private startProgress: Subscription;

  showModal = false;
  modalData: any;

  words: Word[];
  wordEditItem: Word;

  showProgress = true;

  filterTxt = '';
  sortType = '1';
  filterType = 'All';

  constructor(private wordService: WordListService,
              private _snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {

    if (this.authService.user.value == null){
      // this.router.navigate(['/login']);
    }

    this.words = this.wordService.getWords();
    this.wordChangedSub = this.wordService.wordsChanged.subscribe(
      (words: Word[]) => {
        this.showProgress = false;
        this.words = words;
      }
    )

    this.openEditModal = this.wordService.openEditWord.subscribe(
      (id: number) => {

        this.wordEditItem = this.wordService.getWordItem(id);
        this.modalData = { title: 'Edit Word', buttonTitle: 'Save', id: id , editItem: this.wordEditItem};
        this.showModal = true;
      }
    )

    this.serverError = this.wordService.serverError.subscribe(
      (errorMessage: string) => {
        this.showProgress = false;
        this._snackBar.open(errorMessage, null, {"duration": 4000});
      }
    )

    this.startProgress = this.wordService.startProgress.subscribe(
      () => {
        this.showProgress = true;
      }
    )

    this.wordService.fetchWords();
  }

  getFilterTxt(filterData: {text: string , sort: string , filter: string}) {
    this.filterTxt = filterData.text;
    this.sortType = filterData.sort;
    this.filterType = filterData.filter;
  }

  openModal(isNew: boolean, title: string, btnTitle: string){

    this.modalData = { title: title, buttonTitle: btnTitle , editItem: new Word(0 , '' , '')};
    this.showModal = true;
  }

  closeModal(){
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.wordChangedSub.unsubscribe();
    this.openEditModal.unsubscribe();
    this.serverError.unsubscribe();
    this.startProgress.unsubscribe();
  }
}
