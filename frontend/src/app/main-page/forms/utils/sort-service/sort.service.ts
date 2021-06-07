import { Injectable } from '@angular/core';
import { Student } from 'src/app/shared/models/Student';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  sortStudents(
    input: Student[],
    by: 'name' | 'surname',
    order: 'ascending' | 'descending'
  ): Student[] {
    const copy: Student[] = this.copy(input);
    return copy.sort((a, b) =>
      by === 'name'
        ? this.compareStrings(a.name, b.name, order)
        : this.compareStrings(a.surname, b.surname, order)
    );
  }

  private compareStrings(strA: string, strB: string, order: 'ascending' | 'descending'): number {
    strA = strA.toUpperCase();
    strB = strB.toUpperCase();
    if (strA < strB) {
      return order === 'ascending' ? -1 : 1;
    }
    if (strA > strB) {
      return order === 'ascending' ? 1 : -1;
    }
    return 0;
  }

  private copy(input: any): any {
    if (typeof input === 'object') {
      if (Array.isArray(input)) {
        return input.map((item) => this.copy(item));
      }
      let output = {};
      for (const key in input) {
        output[key] = this.copy(input[key]);
      }
      return output;
    }
    return input;
  }
}
