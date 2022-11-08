import {Component, OnDestroy, OnInit} from '@angular/core';
import {Word} from "./word-item/word.model";
import {WordListService} from "./word-list.service";
import {Subscription} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
export class AppComponent implements OnInit, OnDestroy{

  private wordChangedSub: Subscription;
  private openEditModal: Subscription;
  showModal = false;
  modalData: any;

  words: Word[];
  wordEditItem: Word;

  filterTxt = '';
  sortType = '1';
  filterType = 'All';

  constructor(private wordService: WordListService) {}

  ngOnInit() {
    this.words = this.wordService.getWords();
    this.wordChangedSub = this.wordService.wordsChanged.subscribe(
      (words: Word[]) => {
        this.words = words;
      }
    )

    this.openEditModal = this.wordService.openEditWord.subscribe(
      (id: number) => {

        this.wordEditItem = this.wordService.getWordItem(id);
        this.modalData = { title: 'Edit Word', buttonTitle: 'Edit', id: id , editItem: this.wordEditItem};
        this.showModal = true;
      }
    )
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
  }
}
