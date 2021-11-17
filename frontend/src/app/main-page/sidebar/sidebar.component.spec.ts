import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { IStats } from 'src/app/shared/models/IStats';
import { Student } from 'src/app/shared/models/Student';
import { MaterialModule } from '../../material.module';
import { SidebarComponent } from './sidebar.component';

let fakeStudentsDb, fakeStats: IStats;

export class FakeDbService {
  get studentDbObservable() {
    return of(fakeStudentsDb);
  }
  getStudents() {
    return of(true);
  }
  getStats() {
    return of(fakeStats);
  }
}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let routerSpy;

  fakeStudentsDb = [
    new Student(
      'giannino',
      'gianni',
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },

      [],
      true,
      new Date(),
      1,
      '',
      '',
      '',
      '',
      '1'
    ),
    new Student(
      'gianni',
      'gianno',
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },

      [],
      true,
      new Date(),
      1,
      '',
      '',
      '',
      '',
      '1'
    ),
    new Student(
      'alberto',
      'gianno',
      {
        name: 'a',
        surname: 'b',
        fiscalCode: 'aaaaaa',
        address: 'asdfjhalfbanflasdbfasf',
        phoneNumber: 1111111111111111111,
      },

      [],
      true,
      new Date(),
      1,
      '',
      '',
      '',
      '',
      '1'
    ),
  ];
  const getListOptions = () => fixture.debugElement.queryAllNodes(By.css('mat-list-option'));
  const getBadges = () => fixture.debugElement.queryAllNodes(By.css('.mat-badge-text'));

  beforeEach(async () => {
    fakeStats = null;
    routerSpy = jasmine.createSpy('navigate');
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [HttpClientTestingModule, MaterialModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: routerSpy,
          },
        },
        {
          provide: DataService,
          useClass: FakeDbService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(SidebarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options correctly', () => {
    expect(getListOptions().length).toBe(fakeStudentsDb.length);
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

  it(
    'does not visualize stats if there are no data',
    waitForAsync(() => {
      expect(getBadges().length).toBe(0);
    })
  );

  it(
    'does visualize stats if data have been provided',
    waitForAsync(() => {
      const fakeS: IStats = {
        total: 124,
        totalMissing: 333,
      };
      fakeStats = {
        ...fakeS,
      };
      component.ngOnInit();
      fixture.detectChanges();
      expect(getBadges().length).toBe(2);
    })
  );
});
