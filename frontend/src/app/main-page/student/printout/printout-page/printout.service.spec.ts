import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IPdfRequest } from 'src/app/main-page/analytics/IPdfRequest';
import { TimezoneHelperService } from 'src/app/shared/timezone-helper/timezone-helper.service';
import { environment } from 'src/environments/environment';
import { IStudentPdfReqBody } from '../IStudentPdfReqBody';
import { PrintoutService } from './printout.service';

const getTimezoneOffset = () => new TimezoneHelperService().currentTimezone;

describe('PrintoutService', () => {
  let service: PrintoutService, controller: HttpTestingController, trans: TranslateService;
  const dbUrl = environment.dbUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
    });
    service = TestBed.inject(PrintoutService);
    controller = TestBed.inject(HttpTestingController);
    trans = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a basic student request', () => {
    const title = 'aaaaaaaaaaaa';
    trans.use('it');
    const body: IStudentPdfReqBody = {
      _studentId: 'abc',
      columns: ['a', 'b'],
      ascending: true,
      withTotal: true,
    };
    service.getStudentRecsPdf(body).subscribe();
    controller
      .expectOne((req) => {
        expect(req.body).toBeTruthy();
        expect(req.body).toEqual({
          ...body,
          locale: 'it',
          timezoneOffset: getTimezoneOffset(),
        });
        return true;
      })
      .flush(new Blob());
  });

  it('should  send the right data trough the subject', () => {
    const title = 'aaaaaaaaaaaa';
    const body: IPdfRequest = {
      locale: 'it',
      dateStart: new Date(),
      dateEnd: new Date(),
      removeIfWithoutNumber: false,
      removeIfWithNumber: false,
    };
    service.fileReady.subscribe(({ title }) => {
      expect(title).toBe(title);
    });
    service.getAllRecs(body).subscribe();
    const req = controller.expectOne(environment.dbUrl + 'analytics/printout');
    req.flush(new Blob(), {
      headers: new HttpHeaders({ 'file-name': title }),
    });
  });
});
