import { Injectable } from '@angular/core';
import { SortOptions } from 'src/app/shared/models/sort-options';
import { Student } from 'src/app/shared/models/Student';

const optionsName = 'STUDENT_SORT_OPTIONS';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  get localStSortOptions() {
    return JSON.parse(sessionStorage.getItem(optionsName)) ?? null;
  }
  set localStSortOptions(newOp: SortOptions) {
    sessionStorage.setItem(optionsName, JSON.stringify(newOp));
  }

  sortStudents(input: Student[], options: SortOptions): Student[] {
    const copy: Student[] = this.copy(input);
    return copy.sort((a, b) =>
      options.by === 'name'
        ? this.compareStrings(a.name, b.name, options.order)
        : this.compareStrings(a.surname, b.surname, options.order)
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
