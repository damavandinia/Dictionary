export class Word {

  public id: number;
  public englishWord: string;
  public persianWord: string;

  constructor(id: number, englishWord: string, persianWord: string) {

    this.id = id;
    this.englishWord = englishWord;
    this.persianWord = persianWord;
  }
}
