import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {Word} from "../word-item/word.model";
import {WordListService} from "../word-list.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewChecked {

  @Input() modalData: any;
  @Output() close = new EventEmitter<void>();

  showModalProgress = false;

  enWord = new FormControl('', [Validators.required]);
  prWord = new FormControl('', [Validators.required]);

  wordError = false;

  addBtnTitle = $localize `Add`;
  saveTitle = $localize `Save`;
  unknownErrorMessage = $localize `An unknown error occurred!`;

  constructor(private wordService: WordListService) { }

  ngOnInit(): void {}

  ngAfterViewChecked(){
    setTimeout(function() {
      document.getElementById("modalCard").style.marginTop = '0';
    }, 50);
  }

  handleModalForm(form: NgForm){

    const values = form.value;
    const wordItem = new Word(this.modalData.id, values.enWord, values.prWord);

    this.showModalProgress = true;

    if (this.modalData.buttonTitle === this.addBtnTitle){

      if (this.wordService.checkDuplicateWord(wordItem)){
        form.controls['enWord'].setErrors({required: true, incorrect: true});
        this.enWord.setErrors({required: true, incorrect: true});
        this.wordError = true;
        this.showModalProgress = false;
        return;
      }

      this.wordService.addNewWordToServer(wordItem).subscribe(response => {
        this.showModalProgress = false;
        form.reset();
        this.closeAndRefresh();

      } , error => {
        this.showModalProgress = false;

        if (!error.error || !error.error.error){
          this.wordService.serverError.next(this.unknownErrorMessage);
        }else {
          this.wordService.serverError.next(error.error.error);
        }
      });

    }else if (this.modalData.buttonTitle === this.saveTitle){

      this.wordService.editWordOnServer(this.modalData.id , wordItem).subscribe(response => {
        this.showModalProgress = false;
        form.reset();
        this.closeAndRefresh();

      } , error => {
        this.showModalProgress = false;
        if (!error.error || !error.error.error){
          this.wordService.serverError.next(this.unknownErrorMessage);
        }else {
          this.wordService.serverError.next(error.error.error);
        }
      });
    }
  }

  closeAndRefresh(){
    this.wordService.fetchWords();
    this.closeModal();
  }

  closeModal(){
    this.close.emit();
  }

  clearWordError(){
    this.wordError = false;
  }
}
