import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { tablerPigMoney, tablerReportMoney } from '@ng-icons/tabler-icons';
import { matAttachMoney } from '@ng-icons/material-icons/baseline';
import * as fromApp from '../../store/app.reducer';

import { ExpensesComponent } from './expenses.component';
import { NgIconsModule } from '@ng-icons/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';
import {
  bootstrapCaretDownFill,
  bootstrapSearch,
} from '@ng-icons/bootstrap-icons';
import { formatCurrency, formatDate } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;
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
      declarations: [ExpensesComponent, ExpensesTableComponent],
      imports: [
        NgIconsModule.withIcons({
          tablerPigMoney,
          tablerReportMoney,
          matAttachMoney,
          bootstrapCaretDownFill,
          bootstrapSearch,
        }),
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total value of the expenses', () => {
    const expenses = initialState.dashboard.expenses;
    const totalExpenses = expenses.reduce(
      (initial, expense) => initial + expense.value,
      0
    );
    const totalValueParagraph = compiled.querySelector(
      'p'
    ) as HTMLParagraphElement;

    expect(totalValueParagraph.innerText).toContain(
      formatCurrency(totalExpenses, 'pt-BR', '')
    );
  });

  it('should display the number of expenses', () => {
    const expenses = initialState.dashboard.expenses;
    const numberExpensesParagraph = compiled.querySelectorAll(
      'p'
    )[2] as HTMLParagraphElement;

    expect(numberExpensesParagraph.innerText).toContain(
      expenses.length.toString()
    );
  });

  it('should display the average of the expenses', () => {
    const expenses = initialState.dashboard.expenses;
    const totalExpenses = expenses.reduce(
      (initial, expense) => initial + expense.value,
      0
    );
    const averageExpenses = totalExpenses / expenses.length;
    const averageExpensesParagraph = compiled.querySelectorAll(
      'p'
    )[4] as HTMLParagraphElement;

    expect(averageExpensesParagraph.innerText).toContain(
      formatCurrency(averageExpenses, 'pt-BR', '')
    );
  });

  it('should search for expenses by the description', fakeAsync(() => {
    spyOn(component, 'onGetExpenses').and.callThrough();
    spyOn(store, 'dispatch');

    component.searchQuery = 'query';
    fixture.detectChanges();

    const searchInput = compiled.querySelector('input') as HTMLInputElement;

    const searchBtn = compiled.querySelector('button') as HTMLButtonElement;
    searchBtn.click();
    tick();

    expect(component.searchQuery).toEqual(searchInput.value);
    expect(component.onGetExpenses).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should filter the expenses by minValue and maxValue', fakeAsync(() => {
    spyOn(component, 'onGetExpenses').and.callThrough();
    spyOn(store, 'dispatch');

    component.minValue = 1000;
    component.maxValue = 2000;

    const minValueInput = compiled.querySelectorAll(
      'input'
    )[1] as HTMLInputElement;
    const maxValueInput = compiled.querySelectorAll(
      'input'
    )[2] as HTMLInputElement;

    maxValueInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'enter' }));
    fixture.detectChanges();
    tick();

    expect(minValueInput.value).toContain(
      formatCurrency(component.minValue, 'pt-BR', '')
    );
    expect(maxValueInput.value).toContain(
      formatCurrency(component.maxValue, 'pt-BR', '')
    );
    expect(component.onGetExpenses).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();

    flush();
  }));

  it('should filter the expenses by minDate and maxDate', fakeAsync(() => {
    spyOn(component, 'onGetExpenses').and.callThrough();
    spyOn(store, 'dispatch');

    component.startDate = new Date();
    component.endDate = new Date();

    const startDateInput = compiled.querySelectorAll(
      'input'
    )[3] as HTMLInputElement;
    const endDateInput = compiled.querySelectorAll(
      'input'
    )[4] as HTMLInputElement;

    // Simulating closing the date picker, so it triggers the onGetExpenses method
    const datePicker = compiled.querySelector(
      'mat-date-range-picker'
    ) as HTMLElement;
    datePicker.dispatchEvent(new Event('closed'));

    fixture.detectChanges();
    tick();

    expect(formatDate(component.startDate, 'dd/MM/YYYY', 'pt-BR')).toEqual(
      startDateInput.value
    );
    expect(formatDate(component.endDate, 'dd/MM/YYYY', 'pt-BR')).toEqual(
      endDateInput.value
    );
    expect(component.onGetExpenses).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should filter the expenses by isEssential', fakeAsync(() => {
    spyOn(component, 'onGetExpenses').and.callThrough();
    spyOn(store, 'dispatch');

    component.isEssential = true;

    const isEssentialSelect = compiled.querySelector(
      'select'
    ) as HTMLSelectElement;

    isEssentialSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    tick();

    expect(String(component.isEssential)).toEqual(isEssentialSelect.value);
    expect(component.onGetExpenses).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should filter the expenses by category', fakeAsync(() => {
    spyOn(component, 'onGetExpenses').and.callThrough();
    spyOn(store, 'dispatch');

    component.categoryId = 0;

    const categorySelect = compiled.querySelectorAll(
      'select'
    )[1] as HTMLSelectElement;

    categorySelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    tick();

    expect(component.categoryId.toString()).toEqual(categorySelect.value);
    expect(component.onGetExpenses).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));
});
