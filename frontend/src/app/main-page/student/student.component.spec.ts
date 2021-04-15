import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { StudentComponent } from './student.component';

@Directive({
  selector: 'routerLink',
})
export class FakeRouterLink {}

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let dbServ: DataService;
  let dbServiceSpy: jasmine.Spy;
  let router: Router;

  const receipt = new Receipt('12345', 3, new Date(), new Date(), 'Bancomat', 'r1'),
    student = new Student('gianni', 'gianno', '', new Date(), '', '', [], [receipt], 'notes', '1'),
    newNoteText = 'new note',
    getByCss = (css: string) => fixture.debugElement.query(By.css(css)),
    getButtons = () => fixture.debugElement.queryAll(By.css('button')),
    startSpyWithValue = (value?: any) => {
      dbServiceSpy = spyOn(dbServ, 'getStudentWithReceipts').and.returnValue(of(value));
      component.ngOnInit();
      fixture.detectChanges();
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentComponent],
      imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 's1' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    dbServ = TestBed.inject(DataService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can load a student from the id in the url', () => {
    startSpyWithValue(student);
    expect(dbServiceSpy).toHaveBeenCalledOnceWith('s1');
    expect(component.student).toEqual(student);
  });

  it('it should render a student correctly', () => {
    startSpyWithValue(student);
    expect(getByCss('mat-card-title').nativeElement.textContent).toBe(
      student.name + ' ' + student.surname
    );
  });

  it('should render the other template if no student is found', () => {
    startSpyWithValue();
    expect(getByCss('mat-card-title').nativeElement.textContent).toEqual('Sorry...');
  });

  it('should remove students', () => {
    startSpyWithValue(student);
    spyOn(dbServ, 'deleteStudent').and.returnValue(of(true));
    const routerSpy = spyOn(router, 'navigate');
    const deleteBtn = getButtons()[2].nativeElement;
    deleteBtn.click();
    expect(routerSpy).toHaveBeenCalledOnceWith(['']);
  });

  it('it should update note and send it to db', () => {
    startSpyWithValue(student);
    const textarea = getByCss('textarea').nativeElement;
    textarea.value = newNoteText;
    textarea.dispatchEvent(new Event('input'));
    expect(component.student.notes).toBe(newNoteText);
    const updateMethod = spyOn(dbServ, 'updateStudent').and.returnValue(of(component.student));
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    expect(updateMethod).toHaveBeenCalledOnceWith(component.student);
  });

  it('should open and automatically close the success badge', fakeAsync(() => {
    startSpyWithValue(student);
    spyOn(dbServ, 'updateStudent').and.returnValue(of(component.student));
    expect(getByCss('#successBadge')).toBeNull();
    const updateBtn = getButtons()[0].nativeElement;
    updateBtn.click();
    fixture.detectChanges();
    expect(getByCss('#successBadge')).toBeTruthy();
    tick(1000);
    fixture.detectChanges();
    expect(getByCss('#successBadge')).toBeNull();
  }));
});
