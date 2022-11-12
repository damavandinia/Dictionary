import {Component, Input, OnInit} from '@angular/core';
import {Word} from "./word.model";
import {WordListService} from "../word-list.service";
import {MatSnackBar, TextOnlySnackBar} from "@angular/material/snack-bar";
import {MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-word-item',
  templateUrl: './word-item.component.html',
  styleUrls: ['./word-item.component.scss']
})
export class WordItemComponent implements OnInit {

  @Input() word: Word;
  @Input() i: number;
  reservedItem: Word;

  constructor(private wordService: WordListService,
              private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  editItem(id: number){
    this.wordService.openEditWord.next(id);
  }

  deleteItem(id: number){

    this.reservedItem = this.wordService.getWordItem(id);
    this.wordService.deleteWord(id);

    this.openSnackBar('Item was deleted.' , 'Undo');
  }

  openSnackBar(message: string, action: string) {
    let mySnackBar: MatSnackBarRef<TextOnlySnackBar> = this._snackBar.open(message, action, {duration: 3000});
    mySnackBar.onAction().subscribe(() => {

      this.wordService.addNewWord(this.reservedItem);
      mySnackBar.dismiss();
    });
    mySnackBar.afterDismissed().subscribe(() => {
      this.reservedItem = null;
    });
  }

}