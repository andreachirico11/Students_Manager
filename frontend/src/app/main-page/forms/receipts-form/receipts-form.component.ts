import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateComparerValidator } from 'src/app/shared/dateComparerValidator';

@Component({
  selector: 'app-receipts-form',
  templateUrl: './receipts-form.component.html',
  styleUrls: ['./receipts-form.component.scss'],
})
export class ReceiptsFormComponent implements OnInit {
  public rForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.rForm = new FormGroup({
      number: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
      emissionDate: new FormControl({ value: '' }, Validators.required),
      paymentDate: new FormControl(''),
      typeOfPayment: new FormControl('', Validators.required),
    });

    this.rForm
      .get('paymentDate')
      .setValidators([Validators.required, dateComparerValidator(this.rForm.get('emissionDate'))]);
  }

  onSubmit(): void {
    console.log(this.rForm);
  }

  log(x) {
    console.log(x);
  }
}
