import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';
import { MaterialModule } from '../../material.module';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let dbService: DataService;
  let routerSpy;

  const fakeStudentsDb = [
      new Student(
        'gianni',
        'gianno',
        '',
        new Date(),
        '',
        '',
        { name: 'a', surname: 'b', dateOfBirth: new Date(), fiscalCode: 'aaaaaa' },
        [],
        '',
        '1'
      ),
    ],
    getListOptions = () => fixture.debugElement.queryAllNodes(By.css('mat-list-option'));
  beforeEach(async () => {
    routerSpy = jasmine.createSpy('navigate');
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [HttpClientTestingModule, MaterialModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate: routerSpy,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(SidebarComponent);
      component = fixture.componentInstance;
      dbService = TestBed.inject(DataService);
      fixture.detectChanges();
      spyOn(dbService, 'getStudents').and.returnValue(of(fakeStudentsDb));
      component.ngOnInit();
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options correctly', () => {
    expect(getListOptions().length).toBe(1);
  });

  it('should navigate to the right url', () => {
    const emitsPy = spyOn(component.linkPressed, 'emit');

    getListOptions()[0].nativeNode.click();
    expect(routerSpy).toHaveBeenCalledOnceWith(['1']);

    expect(emitsPy).toHaveBeenCalled();
  });

  it('should navigate to the home url if the previous link is pressed', () => {
    getListOptions()[0].nativeNode.click();
    getListOptions()[0].nativeNode.click();
    expect(routerSpy).toHaveBeenCalledWith(['1']);
  });

  it('link press event to be clicked', () => {
    const emitsPy = spyOn(component.linkPressed, 'emit');
    getListOptions()[0].nativeNode.click();
    expect(emitsPy).toHaveBeenCalled();
  });
});
