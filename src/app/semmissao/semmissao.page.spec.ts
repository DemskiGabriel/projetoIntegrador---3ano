import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemmissaoPage } from './semmissao.page';

describe('SemmissaoPage', () => {
  let component: SemmissaoPage;
  let fixture: ComponentFixture<SemmissaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SemmissaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
