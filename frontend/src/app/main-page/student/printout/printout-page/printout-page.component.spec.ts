import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from 'src/app/main-page/forms/forms.module';
import { MaterialModule } from 'src/app/material.module';

import { PrintoutPageComponent } from './printout-page.component';

describe('PrintoutPageComponent', () => {
  let component: PrintoutPageComponent;
  let fixture: ComponentFixture<PrintoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintoutPageComponent],
      imports: [
        TranslateModule.forRoot(),
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
            snapshot: { parent: { params: { id: 'abc' } } },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
