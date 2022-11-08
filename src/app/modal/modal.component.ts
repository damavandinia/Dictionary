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

  enWord = new FormControl('', [Validators.required]);
  prWord = new FormControl('', [Validators.required]);

  wordError = false;

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

    if (this.modalData.buttonTitle === 'Add'){

      if (!this.wordService.addNewWord(wordItem)){

        form.controls['enWord'].setErrors({required: true, incorrect: true});
        this.enWord.setErrors({required: true, incorrect: true});

        this.wordError = true;

        return;
      }

    }else if (this.modalData.buttonTitle === 'Edit'){
      this.wordService.editWord(this.modalData.id , wordItem);
    }

    this.closeModal();
    form.reset();
  }

  closeModal(){
    this.close.emit();
  }

  clearWordError(){
    this.wordError = false;
  }
}
