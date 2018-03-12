import { Pipe, PipeTransform } from '@angular/core';
import * as langs from 'langs';

@Pipe({name: 'countrytooltip'})
export class CountryTooltipPipe implements PipeTransform {

  transform(value: string): any {

    var lang = langs.where("1", value) ? langs.where("1", value).name : null;

    if(lang){
      return lang;
    }else{
      return value;
    }

  }

}