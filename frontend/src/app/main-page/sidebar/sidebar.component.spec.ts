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
  let router: Router;

  const fakeStudentsDb = [new Student('gianni', 'gianno', '', new Date(), '', '', [], [], '', '1')],
    getListOptions = () => fixture.debugElement.queryAllNodes(By.css('mat-list-option'));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [HttpClientTestingModule, MaterialModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(SidebarComponent);
      component = fixture.componentInstance;
      dbService = TestBed.inject(DataService);
      router = TestBed.inject(Router);
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

  it('should navigate to the right url', () => {
    spyOn(dbService, 'getStudents').and.returnValue(of(fakeStudentsDb));
    component.ngOnInit();
    fixture.detectChanges();
    const spy = spyOn(router, 'navigate');
    getListOptions()[0].nativeNode.click();
    expect(spy).toHaveBeenCalledOnceWith(['1']);
  });

  it('should navigate to the home url if the previous link is pressed', () => {
    spyOn(dbService, 'getStudents').and.returnValue(of(fakeStudentsDb));
    component.ngOnInit();
    fixture.detectChanges();
    const spy = spyOn(router, 'navigate');
    getListOptions()[0].nativeNode.click();
    getListOptions()[0].nativeNode.click();
    expect(spy).toHaveBeenCalledWith(['1']);
  });
});
