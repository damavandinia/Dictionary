import { Pipe, PipeTransform } from '@angular/core';
import {Subject} from "rxjs";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, sortType: string, filterType: string, page, itemsToShow: number, filterSubject: Subject<number>): any {

    let resultArray = value;
    const regExp = /^[آ-ی]+$/i;
    let isPersian = false;
    let propName = 'englishWord';

    if (filterString !== ''){

      if (regExp.test(filterString)){
        document.getElementById("searchInput").style.textAlign = 'right';
        propName = 'persianWord';
      }else {
        document.getElementById("searchInput").style.textAlign = 'left';
        propName = 'englishWord';
      }
    }

    resultArray = [];
    for (const item of value){

      let addToList = true;

      if (filterString !== ''){
        if (item[propName].toLowerCase().search(filterString.toLowerCase()) < 0){
          addToList = false;
        }
      }

      if (filterType !== 'All'){
        if (item['englishWord'].charAt(0).toUpperCase() !== filterType.toUpperCase()){
          addToList = false;
        }
      }

      if (addToList){
        resultArray.push(item);
      }
    }

    if (sortType === '1'){
      resultArray.sort((a,b) => (a.englishWord > b.englishWord) ? 1 : ((b.englishWord > a.englishWord) ? -1 : 0))
    }else if (sortType === '2'){
      resultArray.sort((a,b) => (a.englishWord < b.englishWord) ? 1 : ((b.englishWord < a.englishWord) ? -1 : 0))
    }

    if (document.getElementById("emptyWrapper")) {
      if (resultArray.length === 0) {
        document.getElementById("emptyWrapper").classList.add("showEmpty");
      } else {
        document.getElementById("emptyWrapper").classList.remove("showEmpty");
      }
    }
    filterSubject.next(resultArray.length);
    return [ ...resultArray.slice( itemsToShow*(page-1) , itemsToShow*(page) )]
  }

}
