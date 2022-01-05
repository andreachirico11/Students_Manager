import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { StudentResumeComponent } from './student-resume.component';

describe('StudentResumeComponent', () => {
  let component: StudentResumeComponent;
  let fixture: ComponentFixture<StudentResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentResumeComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
