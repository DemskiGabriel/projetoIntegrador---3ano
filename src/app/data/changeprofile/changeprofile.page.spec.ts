import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeprofilePage } from './changeprofile.page';

describe('ChangeprofilePage', () => {
  let component: ChangeprofilePage;
  let fixture: ComponentFixture<ChangeprofilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
