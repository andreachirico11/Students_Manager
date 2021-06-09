import { Component } from '@angular/core';
import { Parent } from 'src/app/shared/models/Parent';
import { FormBaseComponent } from '../../utils/form-base.component';

@Component({
  selector: 'parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss'],
})
export class ParentFormComponent extends FormBaseComponent<Parent> {
  constructor() {
    super('ParentForm');
  }
}
