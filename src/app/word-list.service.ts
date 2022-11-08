import {Injectable} from '@angular/core';
import {Word} from "./word-item/word.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class WordListService {

  wordsChanged = new Subject<Word[]>();
  openEditWord = new Subject<number>();


  private words: Word[] = [
    {id: 1, englishWord: 'Red', persianWord: 'قرمز'},
    {id: 2, englishWord: 'Yellow', persianWord: 'زرد'},
    {id: 3, englishWord: 'Green', persianWord: 'سبز'},
    {id: 4, englishWord: 'Blue', persianWord: 'آبی'},
    {id: 5, englishWord: 'Purple', persianWord: 'بنفش'},
    {id: 6, englishWord: 'White', persianWord: 'سفید'},
    {id: 7, englishWord: 'Brown', persianWord: 'قهوه ای'},
    {id: 8, englishWord: 'Pink', persianWord: 'صورتی'},
  ];

  getWords(){
    return this.words.slice();
  }

  getWordItem(id: number){
    return this.words.find(item => item.id === id);
  }

  addNewWord(word: Word){

    for (const item of this.words){
      if (item.englishWord.toLowerCase() === word.englishWord.toLowerCase()){
        return false;
      }
    }

    let newId = Math.max.apply(Math, this.words.map(function(w) { return w.id; }))
    newId++;
    word.id = newId

    this.words.push(word);
    this.wordsChanged.next(this.words.slice());

    return true;
  }

  editWord(id: number , newWord: Word){
    const index = this.words.findIndex(item => item.id === id);
    this.words[index] = newWord;
    this.wordsChanged.next(this.words.slice());
  }

  deleteWord(id: number){
    const index = this.words.findIndex(item => item.id === id);
    this.words.splice(index , 1);
    this.wordsChanged.next(this.words.slice());
  }
}
