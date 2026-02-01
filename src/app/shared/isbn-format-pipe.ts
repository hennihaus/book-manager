import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbnFormat',
})
export class IsbnFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length !== 13) {
      return value;
    }

    const parts = [
      value.slice(0, 3),
      value.slice(3, 4),
      value.slice(4, 8),
      value.slice(8, 12),
      value.slice(12),
    ];

    return parts.join('-');
  }
}
