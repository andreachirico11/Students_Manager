import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formDateComparerValidator } from 'src/app/shared/dateComparerValidator';

@Component({
  selector: 'app-receipts-form',
  templateUrl: './receipts-form.component.html',
  styleUrls: ['./receipts-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptsFormComponent implements OnInit {
  public rForm: FormGroup;

  get formHasDateError(): boolean {
    return this.rForm.get('paymentDate').getError('dateCannotBeGreater');
  }

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    console.log(this.rForm);
  }

  initForm(): void {
    this.rForm = new FormGroup({
      number: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]*$'),
      ]),
      emissionDate: new FormControl('', Validators.required),
      paymentDate: new FormControl('', Validators.required),
      typeOfPayment: new FormControl('', Validators.required),
    });
    this.rForm.setValidators(
      formDateComparerValidator(this.rForm.get('emissionDate'), this.rForm.get('paymentDate'))
    );
  }

  logform() {
    console.log(this.rForm);
  }
}
