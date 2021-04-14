import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { Student } from 'src/app/shared/models/Student';
import { StudentComponent } from './student.component';
import { StudentModule } from './student.module';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  const student = new Student(
      '1',
      'gianni',
      'gianno',
      '',
      new Date(),
      '',
      '',
      [],
      ['1', '14'],
      'notes'
    ),
    newNoteText = 'new note',
    getByCss = (css: string) => fixture.debugElement.query(By.css(css));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentComponent],
      imports: [FormsModule, CommonModule, MaterialModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;

    component.student = student;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should render a student correctly', () => {
    expect(getByCss('mat-card-title').nativeElement.textContent).toBe(
      student.name + ' ' + student.surname
    );
  });

  it('it should send an updated note', () => {
    const textarea = getByCss('textarea').nativeElement;
    textarea.value = newNoteText;
    textarea.dispatchEvent(new Event('input'));
    expect(component.note).toBe('new note');
  });

  it('should send new notes outside', () => {
    component.updatedNoteEvent.subscribe((newNotes) => {
      expect(newNotes).toBe(newNoteText);
    });
    const textarea = getByCss('textarea').nativeElement;
    textarea.value = newNoteText;
    textarea.dispatchEvent(new Event('input'));
    fixture.debugElement.queryAll(By.directive(MatButton))[2].nativeElement.click();
  });
});
