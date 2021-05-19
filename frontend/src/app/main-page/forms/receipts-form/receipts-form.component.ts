import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { formDateComparerValidator } from 'src/app/shared/dateComparerValidator';
import { PaymentTypeValues } from 'src/app/shared/models/PaymentType';
import { Receipt } from 'src/app/shared/models/Receipts';
import { DataService } from '../../data-service/data.service';
import { AllRegExp } from '../utils/allRegExp';

@Component({
  selector: 'app-receipts-form',
  templateUrl: './receipts-form.component.html',
  styleUrls: ['./receipts-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptsFormComponent implements OnInit {
  private studentId: string;
  private receiptToUpdateId: string;

  public rForm: FormGroup;
  public formMode: 'Add' | 'Update';
  public matSelectValues = PaymentTypeValues;

  get isTouchUiActivate() {
    return window.innerWidth < 500 ? true : false;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.studentId = this.activatedRoute.snapshot.params['studentId'];
    this.receiptToUpdateId = this.activatedRoute.snapshot.params['id'];
    if (this.studentId) {
      this.addNewReceipt();
    } else if (this.receiptToUpdateId) {
      this.updatePreviousReceipt();
    } else {
      this.router.navigate(['']);
    }
  }

  onSubmit(): void {}

  private addNewReceipt() {
    this.formMode = 'Add';
    this.onSubmit = () => this.createAndAdd();
  }

  formHasDateError(): boolean {
    return this.rForm.get('paymentDate').getError('dateCannotBeGreater');
  }

  private updatePreviousReceipt() {
    if (!this.activatedRoute.snapshot.queryParams) {
      return this.router.navigate(['']);
    }
    const rToUp = this.activatedRoute.snapshot.queryParams.receiptToUpdate;
    if (!rToUp) {
      return this.router.navigate(['']);
    }
    this.formMode = 'Update';
    this.onSubmit = () => this.updateExistent();
    const { number, amount, emissionDate, paymentDate, typeOfPayment, ownerId } = JSON.parse(rToUp);
    this.studentId = ownerId;
    this.rForm.patchValue({
      number,
      amount,
      emissionDate: new Date(emissionDate),
      paymentDate: new Date(paymentDate),
      typeOfPayment,
    });
  }

  private initForm(): void {
    this.rForm = new FormGroup({
      number: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(AllRegExp.onlyNumbersReg),
      ]),
      emissionDate: new FormControl('', Validators.required),
      paymentDate: new FormControl(''),
      typeOfPayment: new FormControl('', Validators.required),
    });
    this.rForm.setValidators(
      formDateComparerValidator(this.rForm.get('emissionDate'), this.rForm.get('paymentDate'))
    );
  }

  private createAndAdd() {
    this.dataService
      .addReceipt(this.studentId, this.collectInputs())
      .subscribe((r) => this.onResponse(r));
  }

  private updateExistent() {
    this.dataService
      .updateReceipt({ ...this.collectInputs(), id: this.receiptToUpdateId })
      .subscribe((r) => this.onResponse(r));
  }

  private collectInputs(): Receipt {
    const { number, amount, emissionDate, paymentDate, typeOfPayment } = this.rForm.value;
    return new Receipt(number, amount, emissionDate, typeOfPayment, paymentDate);
  }

  private onResponse(r: boolean) {
    if (r) {
      this.router.navigate([this.studentId]);
    } else {
      this.onError();
    }
  }

  private onError() {
    const componentInstance = this.dialog.open(ConfirmationDialogComponent).componentInstance;
    componentInstance.dialogTitle = `There was a problem ${
      this.formMode === 'Add' ? 'adding' : 'updating'
    } the receipt`;
    componentInstance.onlyConfirmation = true;
  }
}
