import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/material.module';
import { LoadingSpinnerDirective } from './loading-spinner.directive';

describe('LoadingSpinnerDirective', () => {
  let fixture: ComponentFixture<HostCompo>, directive: LoadingSpinnerDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerDirective, HostCompo],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostCompo);
    directive = fixture.debugElement
      .query(By.directive(LoadingSpinnerDirective))
      .injector.get(LoadingSpinnerDirective);
    fixture.detectChanges();
  });

  fit('launches methods at component change', () => {
    const mountSpy = spyOn<any>(directive, 'mountSpinner'),
      unMountSpy = spyOn<any>(directive, 'unMountSpinner');
    fixture.componentInstance.isLoading = true;
    // fixture.detectChanges();
    expect(mountSpy).toHaveBeenCalled();
    // fixture.componentInstance.isLoading = false;
    // fixture.detectChanges();
    // expect(unMountSpy).toHaveBeenCalled();
  });
});

@Component({
  selector: '',
  template: `
    <div loadingSpinner="isLoading">
      <h1>Fake Compo {{ isLoading }}</h1>
    </div>
  `,
})
export class HostCompo {
  isLoading = false;
}
