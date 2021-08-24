import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Parent } from 'src/app/shared/models/Parent';
import { FormBaseComponent } from '../../utils/form-base.component';

@Component({
  selector: 'parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss'],
})
export class ParentFormComponent extends FormBaseComponent<Parent> {
  constructor(d: DateAdapter<any>, t: TranslateService) {
    super('ParentForm', d, t);
  }
}
