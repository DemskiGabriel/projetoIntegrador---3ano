import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmeTocandoPage } from './alarme-tocando.page';

describe('AlarmeTocandoPage', () => {
  let component: AlarmeTocandoPage;
  let fixture: ComponentFixture<AlarmeTocandoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmeTocandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
