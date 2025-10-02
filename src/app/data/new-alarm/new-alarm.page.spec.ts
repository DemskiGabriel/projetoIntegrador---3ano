import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewAlarmPage } from './new-alarm.page';

describe('NewAlarmPage', () => {
  let component: NewAlarmPage;
  let fixture: ComponentFixture<NewAlarmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAlarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
