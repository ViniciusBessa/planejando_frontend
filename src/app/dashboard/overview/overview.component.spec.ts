import { formatCurrency, Location, registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  bootstrapDashCircleFill,
  bootstrapPlusCircleFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxGaugeModule } from 'ngx-gauge';
import * as fromApp from '../../store/app.reducer';
import localePt from '@angular/common/locales/pt';

import { OverviewComponent } from './overview.component';
import { Store } from '@ngrx/store';
import { RevenuesComponent } from '../revenues/revenues.component';
import { ExpensesComponent } from '../expenses/expenses.component';
import { GoalsComponent } from '../goals/goals.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let compiled: HTMLElement;
  let store: Store;
  const initialState: fromApp.AppState = {
    auth: {
      user: {
        id: 9,
        name: 'TestUser',
        email: 'test@email.com',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      loading: false,
      error: null,
    },
    userAccount: {
      error: null,
      loading: false,
      message: null,
    },
    dashboard: {
      categories: [
        {
          id: 3,
          title: 'Finance',
          description: 'Category of financial matters',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Food',
          description: 'Category of food items',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
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
          value: 1000,
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
          sumExpenses: [{ month: 1, total: 400 }],
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
          sumExpenses: [{ month: 1, total: 200 }],
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
      declarations: [OverviewComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard/receitas', component: RevenuesComponent },
          { path: 'dashboard/despesas', component: ExpensesComponent },
          { path: 'dashboard/metas', component: GoalsComponent },
        ]),
        NgIconsModule.withIcons({
          bootstrapDashCircleFill,
          bootstrapPlusCircleFill,
        }),
        NgxGaugeModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should display the user's name", () => {
    const userNameParagraph = compiled.querySelectorAll(
      'p'
    )[1] as HTMLParagraphElement;
    expect(userNameParagraph.innerText).toContain(initialState.auth.user!.name);
  });

  it("should display the user's monthly revenue", () => {
    const monthlyRevenue = initialState.dashboard.revenues.reduce(
      (initial, revenue) => initial + revenue.value,
      0
    );

    const revenuesParagraph = compiled.querySelectorAll(
      'p'
    )[3] as HTMLDivElement;

    expect(revenuesParagraph.innerText).toContain(
      formatCurrency(monthlyRevenue, 'pt-BR', 'R$')
    );
  });

  it("should display the user's monthly expense", () => {
    const monthlyExpense = initialState.dashboard.expenses.reduce(
      (initial, expense) => initial + expense.value,
      0
    );

    const expensesParagraph = compiled.querySelectorAll(
      'p'
    )[5] as HTMLDivElement;

    expect(expensesParagraph.innerText).toContain(
      formatCurrency(monthlyExpense, 'pt-BR', 'R$')
    );
  });

  it("should display the user's account balance", () => {
    const monthlyRevenue = initialState.dashboard.revenues.reduce(
      (initial, revenue) => initial + revenue.value,
      0
    );

    const monthlyExpense = initialState.dashboard.expenses.reduce(
      (initial, expense) => initial + expense.value,
      0
    );

    const balance = monthlyRevenue - monthlyExpense;

    const balanceParagraph = compiled.querySelectorAll(
      'p'
    )[7] as HTMLDivElement;

    expect(balanceParagraph.innerText).toContain(
      formatCurrency(balance, 'pt-BR', 'R$')
    );
  });

  it('should navigate to the expenses page through the icon', fakeAsync(
    inject([Location], (location: Location) => {
      const expensesIcon = compiled.querySelectorAll(
        'ng-icon'
      )[0] as HTMLAnchorElement;
      expensesIcon.click();
      tick();

      expect(location.path()).toEqual('/dashboard/despesas');
    })
  ));

  it('should navigate to the revenues page through the icon', fakeAsync(
    inject([Location], (location: Location) => {
      const revenuesIcon = compiled.querySelectorAll(
        'ng-icon'
      )[1] as HTMLAnchorElement;
      revenuesIcon.click();
      tick();

      expect(location.path()).toEqual('/dashboard/receitas');
    })
  ));

  it('should navigate to the goals page with a link', fakeAsync(
    inject([Location], (location: Location) => {
      const goalsAnchor = compiled.querySelectorAll(
        'a'
      )[0] as HTMLAnchorElement;
      goalsAnchor.click();
      tick();

      expect(location.path()).toEqual('/dashboard/metas');
    })
  ));

  it('should navigate to the expenses page with a link', fakeAsync(
    inject([Location], (location: Location) => {
      const expensesAnchor = compiled.querySelectorAll(
        'a'
      )[1] as HTMLAnchorElement;
      expensesAnchor.click();
      tick();

      expect(location.path()).toEqual('/dashboard/despesas');
    })
  ));

  it('should navigate to the revenues page with a link', fakeAsync(
    inject([Location], (location: Location) => {
      const revenuesAnchor = compiled.querySelectorAll(
        'a'
      )[2] as HTMLAnchorElement;
      revenuesAnchor.click();
      tick();

      expect(location.path()).toEqual('/dashboard/receitas');
    })
  ));
});
