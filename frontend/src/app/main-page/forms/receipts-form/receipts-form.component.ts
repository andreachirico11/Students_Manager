import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { formDateComparerValidator } from 'src/app/shared/dateComparerValidator';
import { PaymentTypeValues } from 'src/app/shared/models/PaymentType';
import { Receipt } from 'src/app/shared/models/Receipts';
import { UpdateDataService } from 'src/app/shared/update-data.service';
import { DataService } from '../../data-service/data.service';
import { AllRegExp } from '../utils/allRegExp';
import { ComponentGuarded } from '../utils/guard-base.component';

@Component({
  selector: 'receipts-form',
  templateUrl: './receipts-form.component.html',
  styleUrls: ['./receipts-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptsFormComponent extends ComponentGuarded implements OnInit, OnDestroy {
  public rForm: FormGroup;
  public isUpdating: boolean = false;
  public matSelectValues = PaymentTypeValues;

  get isTouchUiActivate() {
    return window.innerWidth < 500 ? true : false;
  }

  private studentId: string;
  private receiptToUpdateId: string;
  private valueSub: Subscription;
  private transSub: Subscription;

  constructor(
    dialog: MatDialog,
    translator: TranslateService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private updateDataService: UpdateDataService<Receipt>,
    private location: Location,
    private dateAd: DateAdapter<any>,
    private tServ: TranslateService
  ) {
    super(dialog, translator);
  }

  @ViewChild(MatSelect)
  public select: MatSelect;

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
    this.valueSub = this.rForm.valueChanges.subscribe((x) => {
      this.canLeave = false;
    });
    this.dateAd.setLocale(this.tServ.currentLang);
    this.transSub = this.tServ.onLangChange.subscribe((ev) => {
      this.dateAd.setLocale(ev.lang);
    });
  }

  ngOnDestroy() {
    this.transSub.unsubscribe();
    this.valueSub.unsubscribe();
  }

  onSubmit(): void {}

  formHasDateError(): boolean {
    return this.rForm.get('paymentDate').getError('dateCannotBeGreater');
  }

  clearPaymentDate() {
    this.rForm.controls.paymentDate.setValue('');
  }

  private addNewReceipt() {
    this.onSubmit = () => this.createAndAdd();
  }

  private updatePreviousReceipt() {
    const rToUp = this.updateDataService.getElementUnderUpdate();
    if (!rToUp) {
      return this.router.navigate(['']);
    }
    this.isUpdating = true;
    this.onSubmit = () => this.updateExistent();
    this.rForm.patchValue({
      number: rToUp.number,
      amount: rToUp.amount,
      emissionDate: rToUp.emissionDate,
      paymentDate: rToUp.paymentDate,
      typeOfPayment: rToUp.typeOfPayment,
    });
  }

  private initForm(): void {
    this.rForm = new FormGroup({
      number: new FormControl(''),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(AllRegExp.onlyNumbersReg),
      ]),
      emissionDate: new FormControl('', Validators.required),
      paymentDate: new FormControl(''),
      typeOfPayment: new FormControl(''),
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
    return new Receipt(amount, emissionDate, number || null, typeOfPayment || null, paymentDate);
  }

  private onResponse(r: boolean) {
    if (r) {
      this.canLeave = true;
      this.location.back();
    } else {
      this.onError();
    }
  }

  private onError() {
    const componentInstance = this.dialog.open(ConfirmationDialogComponent).componentInstance;
    componentInstance.successBtnLabel = this.translations['YES'];
    componentInstance.unsuccessBtnLabel = this.translations['NO'];
    componentInstance.dialogTitle = this.studentId
      ? this.translations['REC_UPDT_ERR']
      : this.translations['REC_ADD_ERR'];
    componentInstance.onlyConfirmation = true;
  }
}
