import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DataService } from 'src/app/shared/data-service/data.service';
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
  const receipt = new Receipt('r1', '12345', 3, new Date(), new Date(), 'Bancomat'),
    student = new Student('1', 'gianni', 'gianno', '', new Date(), '', '', [], [receipt], 'notes'),
    newNoteText = 'new note',
    getByCss = (css: string) => fixture.debugElement.query(By.css(css));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentComponent],
      imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
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
    component.student = student;
    dbServ = TestBed.inject(DataService);
    dbServiceSpy = spyOn(dbServ, 'getStudentWithReceipts').and.returnValue(of(student));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can load a student from the id in the url', () => {
    expect(dbServiceSpy).toHaveBeenCalledOnceWith('s1');
    expect(component.student).toEqual(student);
  });

  it('it should render a student correctly', () => {
    expect(getByCss('mat-card-title').nativeElement.textContent).toBe(
      student.name + ' ' + student.surname
    );
  });

  // it('it should send an updated note', () => {
  //   const textarea = getByCss('textarea').nativeElement;
  //   textarea.value = newNoteText;
  //   textarea.dispatchEvent(new Event('input'));
  //   expect(component.note).toBe('new note');
  // });

  // it('should send new notes outside', () => {
  //   component.updatedNoteEvent.subscribe((newNotes) => {
  //     expect(newNotes).toBe(newNoteText);
  //   });
  //   const textarea = getByCss('textarea').nativeElement;
  //   textarea.value = newNoteText;
  //   textarea.dispatchEvent(new Event('input'));
  //   fixture.debugElement.queryAll(By.directive(MatButton))[2].nativeElement.click();
  // });
});
