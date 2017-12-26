import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'arrayDays'
})
export class ArrayDaysPipe implements PipeTransform {

  transform(date?: any, format?: any, args?: any): any {

    if(!date)
      date = new Date();

    var startOfWeek = moment(date).startOf('week');
    var endOfWeek = moment(date).endOf('week');

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
