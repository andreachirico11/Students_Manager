import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { MaterialModule } from 'src/app/material.module';
import { FAKE_DB } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Receipt } from 'src/app/shared/models/Receipts';
import { DataService } from '../../data-service/data.service';
import { ReceiptsActionsComponent } from './receipts-actions/receipts-actions.component';
import { ReceiptsTableComponent } from './receipts-table.component';

describe('ReceiptsTableComponent', () => {
  let component: ReceiptsTableComponent;
  let fixture: ComponentFixture<ReceiptsTableComponent>;
  let dataS: DataService;

  const fakeFirstRecId = 'fake',
    fakeFirstRecNumber = '1111';
  const fakeFirstRec: Receipt = new Receipt(
    fakeFirstRecNumber,
    50,
    new Date(),
    'Moneta',
    new Date(),
    fakeFirstRecId
  );
  const fakeRec = [fakeFirstRec, ...FAKE_DB.students.find((s) => s.receipts.length > 0).receipts];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReceiptsActionsComponent, ReceiptsTableComponent],
        imports: [
          CommonModule,
          MaterialModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          RouterModule.forRoot([]),
        ],
        providers: [
          {
            provide: MatDialog,
            useClass: MockMatDialog,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptsTableComponent);
    dataS = TestBed.inject(DataService);
    component = fixture.componentInstance;
    component.receipts = fakeRec;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of row with data', () => {
    expect(fixture.debugElement.queryAll(By.css('tr')).length).toBe(fakeRec.length + 1);
  });

  it('should display correctly firs row data', () => {
    expect(fixture.debugElement.queryAll(By.css('td'))[1].nativeElement.textContent).toBe(
      fakeFirstRecNumber
    );
  });

  it('should collect recipe actions component events', () => {
    const updateOrDeleteSpy = spyOn(component, 'onUpdateOrDelete');
    const secondRowActions = fixture.debugElement.queryAll(
      By.directive(ReceiptsActionsComponent)
    )[1].componentInstance as ReceiptsActionsComponent;
    secondRowActions.emit('update');
    expect(updateOrDeleteSpy).toHaveBeenCalledOnceWith({ type: 'update', id: fakeRec[1].id });
  });

  it('should remove the first receipt from the view', () => {
    spyOn(dataS, 'deleteReceipt').and.returnValue(of(true));
    component.onUpdateOrDelete({ type: 'delete', id: fakeRec[0].id });
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('td'))[0].nativeElement.textContent).not.toBe(
      fakeFirstRecNumber
    );
  });

  it('visualize the add button if there are no receipts', () => {
    expect(fixture.debugElement.query(By.css('.noDataBtn'))).toBeFalsy();
    component.receipts = [];
    component.tableDataSource = null;
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.noDataBtn'))).toBeTruthy();
  });

  it('should add the payed voice to data correctly', () => {
    expect(component.tableDataSource.data[0].payed).toBeTruthy();
    component.receipts[0].paymentDate = null;
    component.ngOnInit();
    expect(component.tableDataSource.data[0].payed).toBeFalsy();
  });
});

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true),
      componentInstance: {
        dialogTitle: '',
      },
    };
  }
}
