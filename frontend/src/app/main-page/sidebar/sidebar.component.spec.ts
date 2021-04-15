import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DataService } from 'src/app/main-page/data-service/data.service';
import { Student } from 'src/app/shared/models/Student';
import { MaterialModule } from '../../material.module';
import { SidebarComponent } from './sidebar.component';

@Directive({
  selector: '[routerLink]',
})
export class FakeRouterLink {
  @Input()
  routerLink;
}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let dbService: DataService;

  const fakeStudentsDb = [new Student('gianni', 'gianno', '', new Date(), '', '', [], [], '', '1')],
    getListOptions = () => fixture.debugElement.queryAllNodes(By.css('mat-list-option'));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent, FakeRouterLink],
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
});
