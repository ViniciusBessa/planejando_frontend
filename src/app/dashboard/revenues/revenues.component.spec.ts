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
  bootstrapBarChartFill,
  bootstrapCaretDownFill,
  bootstrapClipboardDataFill,
  bootstrapPencilFill,
  bootstrapSearch,
  bootstrapTrash3Fill,
} from '@ng-icons/bootstrap-icons';
import localePt from '@angular/common/locales/pt';
import { NgIconsModule } from '@ng-icons/core';
import { matAttachMoney } from '@ng-icons/material-icons/baseline';
import { tablerPigMoney, tablerReportMoney } from '@ng-icons/tabler-icons';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { RevenuesTableComponent } from './revenues-table/revenues-table.component';
import * as fromApp from '../../store/app.reducer';

import { RevenuesComponent } from './revenues.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RevenuesGraphicsComponent } from './revenues-graphics/revenues-graphics.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

describe('RevenuesComponent', () => {
  let component: RevenuesComponent;
  let fixture: ComponentFixture<RevenuesComponent>;
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
      revenues: [
        {
          id: 2,
          userId: 4,
          value: 200,
          description: 'New revenue',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          userId: 4,
          value: 300,
          description: 'Food revenue',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      expenses: [],
      goals: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [
        RevenuesComponent,
        RevenuesTableComponent,
        RevenuesGraphicsComponent,
        SidebarComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        NgIconsModule.withIcons({
          tablerPigMoney,
          tablerReportMoney,
          matAttachMoney,
          bootstrapCaretDownFill,
          bootstrapSearch,
          bootstrapPencilFill,
          bootstrapTrash3Fill,
          bootstrapBarChartFill,
          bootstrapClipboardDataFill,
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

    fixture = TestBed.createComponent(RevenuesComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total value of the revenues', () => {
    const revenues = initialState.dashboard.revenues;
    const totalRevenues = revenues.reduce(
      (initial, revenue) => initial + revenue.value,
      0
    );
    const totalValueParagraph = compiled.querySelector(
      'p'
    ) as HTMLParagraphElement;

    expect(totalValueParagraph.innerText).toContain(
      formatCurrency(totalRevenues, 'pt-BR', '')
    );
  });

  it('should display the number of revenues', () => {
    const revenues = initialState.dashboard.revenues;
    const numberRevenuesParagraph = compiled.querySelectorAll(
      'p'
    )[2] as HTMLParagraphElement;

    expect(numberRevenuesParagraph.innerText).toContain(
      revenues.length.toString()
    );
  });

  it('should display the average of the revenues', () => {
    const revenues = initialState.dashboard.revenues;
    const totalRevenues = revenues.reduce(
      (initial, revenue) => initial + revenue.value,
      0
    );
    const averageRevenues = totalRevenues / revenues.length;
    const averageRevenuesParagraph = compiled.querySelectorAll(
      'p'
    )[4] as HTMLParagraphElement;

    expect(averageRevenuesParagraph.innerText).toContain(
      formatCurrency(averageRevenues, 'pt-BR', '')
    );
  });

  it('should search for revenues by the description', fakeAsync(() => {
    spyOn(component, 'onGetRevenues').and.callThrough();
    spyOn(store, 'dispatch');

    component.searchQuery = 'query';
    fixture.detectChanges();

    const searchInput = compiled.querySelector('input') as HTMLInputElement;

    const searchBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;
    searchBtn.click();
    tick();

    expect(component.searchQuery).toEqual(searchInput.value);
    expect(component.onGetRevenues).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should filter the revenues by minValue and maxValue', fakeAsync(() => {
    spyOn(component, 'onGetRevenues').and.callThrough();
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
    expect(component.onGetRevenues).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();

    flush();
  }));

  it('should filter the revenues by minDate and maxDate', fakeAsync(() => {
    spyOn(component, 'onGetRevenues').and.callThrough();
    spyOn(store, 'dispatch');

    component.startDate = new Date();
    component.endDate = new Date();

    const startDateInput = compiled.querySelectorAll(
      'input'
    )[3] as HTMLInputElement;
    const endDateInput = compiled.querySelectorAll(
      'input'
    )[4] as HTMLInputElement;

    // Simulating closing the date picker, so it triggers the onGetRevenues method
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
    expect(component.onGetRevenues).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));
});
