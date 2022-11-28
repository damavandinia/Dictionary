import {Component, Input, OnInit} from '@angular/core';
import {Word} from "./word.model";
import {WordListService} from "../word-list.service";
import {MatSnackBar, TextOnlySnackBar} from "@angular/material/snack-bar";
import {MatSnackBarRef} from '@angular/material/snack-bar';
import {DataSource} from "@angular/cdk/collections";

@Component({
  selector: 'app-word-item',
  templateUrl: './word-item.component.html',
  styleUrls: ['./word-item.component.scss']
})
export class WordItemComponent implements OnInit {

  @Input() words: Word[];
  reservedItem: Word;
  displayedColumns: string[] = ['no', 'word', 'meaning', 'option'];

  constructor(private wordService: WordListService,
              private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  editItem(id: number){
    this.wordService.openEditWord.next(id);
  }

  deleteItem(id: number){

    this.wordService.startProgress.next(null);

    this.reservedItem = this.wordService.getWordItem(id);

    this.wordService.deleteWordFromServer(id).subscribe(response => {
      this.openSnackBar('Item was deleted.' , 'Undo');
      this.wordService.fetchWords();
    } , error => {
      this.wordService.serverError.next(error.error.error);
    });
  }

  openSnackBar(message: string, action: string) {
    let mySnackBar: MatSnackBarRef<TextOnlySnackBar> = this._snackBar.open(message, action, {duration: 3000});
    mySnackBar.onAction().subscribe(() => {

      this.wordService.startProgress.next(null);

      this.wordService.addNewWordToServer(this.reservedItem).subscribe(response => {
        mySnackBar.dismiss();
        this.wordService.fetchWords();
      } , error => {
        this.wordService.serverError.next(error.error.error);
      });

    });
    mySnackBar.afterDismissed().subscribe(() => {
      this.reservedItem = null;
    });
  }

}
