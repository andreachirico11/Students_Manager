import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { IStudentPdfReqBody } from '../IStudentPdfReqBody';
import { PrintoutService } from './printout.service';

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

  it('should correctly add locale params', () => {
    trans.use('it');
    service.getPdf().subscribe();
    controller
      .expectOne((req) => {
        expect(req.params.has('locale')).toBeTruthy();
        expect(req.params.get('locale')).toBe(trans.currentLang);
        return true;
      })
      .flush(new Blob());
  });

  it('should send a basic student request', () => {
    const title = 'aaaaaaaaaaaa';
    const body: IStudentPdfReqBody = {
      _studentId: 'abc',
      locale: 'it',
      columns: ['a', 'b'],
    };
    service.getStudentRecsPdf(body).subscribe();
    controller
      .expectOne((req) => {
        expect(req.body).toBeTruthy();
        expect(req.body).toEqual(body);
        return true;
      })
      .flush(new Blob());
  });

  it('should retrieve file title from request', () => {
    const title = 'aaaaaaaaaaaa';
    const body: IStudentPdfReqBody = {
      _studentId: 'abc',
      locale: 'it',
      columns: ['a', 'b'],
    };
    service.getStudentRecsPdf(body).subscribe((result) => {
      expect(result.title).toBe(title);
    });
    const req = controller.expectOne(environment.dbUrl + 'printout/studentRecap');
    req.flush(new Blob(), {
      headers: new HttpHeaders({ 'file-name': title }),
    });
  });
});
