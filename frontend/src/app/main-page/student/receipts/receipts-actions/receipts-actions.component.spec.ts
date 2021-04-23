import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptsActionsComponent } from './receipts-actions.component';

describe('ReceiptsActionsComponent', () => {
  let component: ReceiptsActionsComponent;
  let fixture: ComponentFixture<ReceiptsActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptsActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
