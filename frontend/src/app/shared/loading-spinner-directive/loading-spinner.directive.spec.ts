import { Component, DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemePalette } from '@angular/material/core';
import { MatSpinner } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/material.module';
import { LoadingSpinnerDirective } from './loading-spinner.directive';

describe('LoadingSpinnerDirective', () => {
  let fixture: ComponentFixture<HostCompo>, directive: DebugNode;

  const getTemplate = () => fixture.debugElement.query(By.css('h1'));

  const getSpinner = () => fixture.debugElement.query(By.directive(MatSpinner));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerDirective, HostCompo],
      imports: [MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostCompo);
    fixture.detectChanges();
  });

  it('add and remove template content', () => {
    fixture.componentInstance.isLoading = true;
    fixture.detectChanges();
    expect(getTemplate()).toBeFalsy();
    fixture.componentInstance.isLoading = false;
    fixture.detectChanges();
    expect(getTemplate()).toBeTruthy();
  });

  it('should empty the container and create a dynamic component', () => {
    fixture.componentInstance.isLoading = true;
    fixture.detectChanges();
    expect(getSpinner()).toBeTruthy();
    fixture.componentInstance.isLoading = false;
    fixture.detectChanges();
    expect(getSpinner()).toBeFalsy();
  });

  it('succesfully pass palette color and changes it via property binding', () => {
    fixture.componentInstance.isLoading = true;
    fixture.componentInstance.palette = 'warn';
    fixture.detectChanges();
    expect(getSpinner().classes['mat-warn']).toBeTrue();
    fixture.componentInstance.palette = 'accent';
    fixture.detectChanges();
    expect(getSpinner().classes['mat-accent']).toBeTrue();
  });
});

@Component({
  selector: '',
  template: `
    <div *loadingSpinner="[isLoading, palette]">
      <h1 class="fakeContent">Fake Compo</h1>
    </div>
  `,
})
export class HostCompo {
  isLoading = false;
  palette: ThemePalette;
}
