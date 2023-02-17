import {
  formatCurrency,
  formatDate,
  registerLocaleData,
} from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  bootstrapCaretDownFill,
  bootstrapSearch,
  bootstrapTrash3Fill,
  bootstrapPencilFill,
  bootstrapXCircleFill,
  bootstrap123,
  bootstrapCheck2All,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import * as fromApp from '../../store/app.reducer';
import localePt from '@angular/common/locales/pt';

import { GoalsComponent } from './goals.component';
import { BrowserModule } from '@angular/platform-browser';
import { GoalListComponent } from './goal-list/goal-list.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { RouterTestingModule } from '@angular/router/testing';

describe('GoalsComponent', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;
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
      expenses: [],
      goals: [
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
          essentialExpenses: true,
          sumExpenses: 0,
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
          essentialExpenses: true,
          sumExpenses: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [GoalsComponent, GoalListComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        NgIconsModule.withIcons({
          bootstrapCaretDownFill,
          bootstrapSearch,
          bootstrapPencilFill,
          bootstrapTrash3Fill,
          bootstrapCheck2All,
          bootstrapXCircleFill,
          bootstrap123,
        }),
        NgxGaugeModule,
        BrowserModule,
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

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the number of goals', () => {
    const goals = initialState.dashboard.goals;
    const goalsLengthParagraph = compiled.querySelector(
      'p'
    ) as HTMLParagraphElement;

    expect(goalsLengthParagraph.innerText).toEqual(goals.length.toString());
  });

  it('should display the number of goals on progress', () => {
    const goals = initialState.dashboard.goals;
    const goalsInProgress = goals.filter(
      (goal) => goal.value >= goal.sumExpenses
    );
    const goalsAchievedParagraph = compiled.querySelectorAll(
      'p'
    )[2] as HTMLParagraphElement;

    expect(goalsAchievedParagraph.innerText).toEqual(
      goalsInProgress.length.toString()
    );
  });

  it('should display the number of goals not achieved', () => {
    const goals = initialState.dashboard.goals;
    const goalsNotAchieved = goals.filter(
      (goal) => goal.value < goal.sumExpenses
    );
    const goalsAchievedParagraph = compiled.querySelectorAll(
      'p'
    )[4] as HTMLParagraphElement;

    expect(goalsAchievedParagraph.innerText).toEqual(
      goalsNotAchieved.length.toString()
    );
  });

  it('should filter the expenses by minValue and maxValue', fakeAsync(() => {
    spyOn(component, 'onGetGoals').and.callThrough();
    spyOn(store, 'dispatch');

    component.minValue = 1000;
    component.maxValue = 2000;

    const minValueInput = compiled.querySelectorAll(
      'input'
    )[0] as HTMLInputElement;
    const maxValueInput = compiled.querySelectorAll(
      'input'
    )[1] as HTMLInputElement;

    maxValueInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'enter' }));
    fixture.detectChanges();
    tick();

    expect(minValueInput.value).toContain(
      formatCurrency(component.minValue, 'pt-BR', '')
    );
    expect(maxValueInput.value).toContain(
      formatCurrency(component.maxValue, 'pt-BR', '')
    );
    expect(component.onGetGoals).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();

    flush();
  }));

  it('should filter the expenses by minDate and maxDate', fakeAsync(() => {
    spyOn(component, 'onGetGoals').and.callThrough();
    spyOn(store, 'dispatch');

    component.startDate = new Date();
    component.endDate = new Date();

    const startDateInput = compiled.querySelectorAll(
      'input'
    )[2] as HTMLInputElement;
    const endDateInput = compiled.querySelectorAll(
      'input'
    )[3] as HTMLInputElement;

    // Simulating closing the date picker, so it triggers the onGetGoals method
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
    expect(component.onGetGoals).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should filter the expenses by essentialExpenses', fakeAsync(() => {
    spyOn(component, 'onGetGoals').and.callThrough();
    spyOn(store, 'dispatch');

    component.essentialExpenses = true;

    const essentialExpensesSelect = compiled.querySelector(
      'select'
    ) as HTMLSelectElement;

    essentialExpensesSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    tick();

    expect(String(component.essentialExpenses)).toEqual(
      essentialExpensesSelect.value
    );
    expect(component.onGetGoals).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should filter the expenses by category', fakeAsync(() => {
    spyOn(component, 'onGetGoals').and.callThrough();
    spyOn(store, 'dispatch');

    component.categoryId = 0;

    const categorySelect = compiled.querySelectorAll(
      'select'
    )[1] as HTMLSelectElement;

    categorySelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    tick();

    expect(component.categoryId.toString()).toEqual(categorySelect.value);
    expect(component.onGetGoals).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));
});
