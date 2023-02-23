import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import localePt from '@angular/common/locales/pt';
import { NgChartsModule } from 'ng2-charts';
import * as fromApp from '../../../store/app.reducer';

import { ExpensesGraphicsComponent } from './expenses-graphics.component';

describe('ExpensesGraphicsComponent', () => {
  let component: ExpensesGraphicsComponent;
  let fixture: ComponentFixture<ExpensesGraphicsComponent>;
  let compiled: HTMLElement;
  let store: Store;
  const initialState: fromApp.AppState = {
    auth: {
      user: null,
      loading: false,
      error: null,
    },
    userAccount: {
      error: null,
      loading: false,
      message: null,
    },
    dashboard: {
      categories: [],
      revenues: [],
      expenses: [
        {
          id: 2,
          categoryId: 3,
          userId: 4,
          category: {
            id: 3,
            title: 'Finance',
            description: 'Category of financial matters',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          value: 200,
          description: 'New expense',
          isEssential: false,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          categoryId: 2,
          userId: 4,
          category: {
            id: 2,
            title: 'Food',
            description: 'Category of food items',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          value: 300,
          description: 'Food expense',
          isEssential: true,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      goals: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [ExpensesGraphicsComponent],
      imports: [FormsModule, NgChartsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesGraphicsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
