import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'arrayDays'
})
export class ArrayDaysPipe implements PipeTransform {

  transform(date?: any, format?: any, startOf?:any, args?: any): any {

    if(!date)
      date = new Date();
    
    if (!format)
      format = 'YYYY-MM-DD';
    
    if (!startOf)
      startOf = 'week';

    var startOfWeek = moment(date).startOf(startOf);
    var endOfWeek = moment(date).endOf(startOf);

    var days = [];
    var day = startOfWeek;

    while (day <= endOfWeek) {
      if(format)
        days.push(day.format(format));
      else
        days.push(day.toDate());
      
      day = day.clone().add(1, 'd');
    }

    return days;
  }

}
