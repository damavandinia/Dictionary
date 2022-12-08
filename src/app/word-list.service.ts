import {Injectable} from '@angular/core';
import {Word} from "./word-item/word.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {AuthService} from "./auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class WordListService {

  wordsChanged = new Subject<Word[]>();
  openEditWord = new Subject<number>();
  startProgress = new Subject<null>();
  serverError = new Subject<string>();

  private words: Word[] = [
    // {id: 1, englishWord: 'Red', persianWord: 'قرمز'},
    // {id: 2, englishWord: 'Yellow', persianWord: 'زرد'},
    // {id: 3, englishWord: 'Green', persianWord: 'سبز'},
    // {id: 4, englishWord: 'Blue', persianWord: 'آبی'},
    // {id: 5, englishWord: 'Purple', persianWord: 'بنفش'},
    // {id: 6, englishWord: 'White', persianWord: 'سفید'},
    // {id: 7, englishWord: 'Brown', persianWord: 'قهوه ای'},
    // {id: 8, englishWord: 'Pink', persianWord: 'صورتی'},
  ];

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getWords(){
    return this.words.slice();
  }

  getWordItem(id: number){
    return this.words.find(item => item.id === id);
  }

  addNewWord(word: Word){

    if (this.checkDuplicateWord){return false;}

    let newId = Math.max.apply(Math, this.words.map(function(w) { return w.id; }))
    newId++;
    word.id = newId
    this.words.push(word);

    this.wordsChanged.next(this.words.slice());

    return true;
  }

  checkDuplicateWord(word: Word){
    for (const item of this.words){
      if (item.englishWord.toLowerCase() === word.englishWord.toLowerCase()){
        return true;
      }
    }
    return false;
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


  //------------------SERVER---------------------

  setWords(words: Word[]){
    this.words = words;
    this.wordsChanged.next(this.words.slice());
  }

  fetchWords(){

    // this.setWords(this.words);
    // return;

    this.startProgress.next(null);

    this.http.get<Word[]>('https://dictionary-90a42-default-rtdb.firebaseio.com/'+this.getUserId()+'/words.json')
      .pipe(
        map(responseData => {
          const resultArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              resultArray.push({...responseData[key], id: key})
            }
          }
          return resultArray;
        }))
      .subscribe(words => {
          this.setWords(words);
        }, error => {
          this.serverError.next(error.error.error);
        }
      );
  }

  addNewWordToServer(word: Word){
    return this.http.post('https://dictionary-90a42-default-rtdb.firebaseio.com/'+this.getUserId()+'/words/.json' , word);
  }

  editWordOnServer(id: number , editedWord: Word){
    return this.http.patch('https://dictionary-90a42-default-rtdb.firebaseio.com/'+this.getUserId()+'/words/'+id+'/.json' , editedWord);
  }

  deleteWordFromServer(id: number){
    return this.http.delete('https://dictionary-90a42-default-rtdb.firebaseio.com/'+this.getUserId()+'/words/'+id+'/.json');
  }

  getUserId(){
    if (!this.authService.user.value){return null;}
    return this.authService.user.value.id;
  }
}
