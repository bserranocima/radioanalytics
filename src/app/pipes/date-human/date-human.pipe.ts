import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({
  name: 'dateHuman'
})
export class DateHumanPipe implements PipeTransform {

  /**
   * Takes a value and returns the date.
   */
  transform(date: any, args?: any): any {

    if(typeof date == 'string')
      return moment(date).format('YYYY-MM-DD HH:mm');
    
    return moment(date, "YYYY-MM-DD HH:mm:ss").format('DD [de] MMMM [de] YYYY');
  }

}
