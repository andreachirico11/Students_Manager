import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DataService } from 'src/app/shared/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';
import { MaterialModule } from '../../material.module';
import { SidebarComponent } from './sidebar.component';

describe('MainPageComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let dbService: DataService;

  const fakeStudentsDb = [
      new Student('1', 'gianni', 'gianno', '', new Date(), '', '', [], ['1', '14'], ''),
    ],
    getListOptions = () => fixture.debugElement.queryAllNodes(By.css('mat-list-option'));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [HttpClientTestingModule, MaterialModule],
    }).compileComponents();
  });

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(SidebarComponent);
      component = fixture.componentInstance;
      dbService = TestBed.inject(DataService);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options correctly', () => {
    spyOn(dbService, 'getStudents').and.returnValue(of(fakeStudentsDb));
    component.ngOnInit();
    fixture.detectChanges();
    expect(getListOptions().length).toBe(1);
  });

  it('should emit the student on click ', () => {
    component.studentSelected.subscribe((student) => {
      expect(student).toEqual(fakeStudentsDb[0]);
    });
    spyOn(dbService, 'getStudents').and.returnValue(of(fakeStudentsDb));
    component.ngOnInit();
    fixture.detectChanges();
    getListOptions()[0].nativeNode.click();
  });
});
