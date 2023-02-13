import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { of, catchError, map, Observable, concatMap, mergeMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { Expense } from '../models/expense.model';
import { Goal } from '../models/goal.model';
import { Revenue } from '../models/revenue.model';
import * as DashboardActions from './dashboard.actions';

const handleError = (
  errorResponse: HttpErrorResponse
): Observable<
  {
    error: Error;
  } & TypedAction<'[Dashboard] Dashboard Fail'>
> => {
  const error = errorResponse.error.err;
  return of(DashboardActions.dashboardFail({ error: new Error(error) }));
};

const getHttpParams = (queryParams: {
  [key: string]: string | number | boolean | Date | undefined;
}): HttpParams => {
  let params = new HttpParams();

  for (const key in queryParams) {
    const value = queryParams[key];

    if (value !== undefined) {
      params = params.append(
        key,
        value instanceof Date ? value.toISOString() : value
      );
    }
  }
  return params;
};

function normalizeCategory(category: Category): Category {
  return {
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
  };
}

function normalizeRevenue(revenue: Revenue): Revenue {
  return {
    ...revenue,
    value: Number(revenue.value),
    date: new Date(revenue.date),
    createdAt: new Date(revenue.createdAt),
    updatedAt: new Date(revenue.updatedAt),
  };
}

function normalizeGoal(goal: Goal): Goal {
  return {
    ...goal,
    value: Number(goal.value),
    essentialExpenses: Boolean(goal.essentialExpenses),
    createdAt: new Date(goal.createdAt),
    updatedAt: new Date(goal.updatedAt),
  };
}

function normalizeExpense(expense: Expense): Expense {
  return {
    ...expense,
    value: Number(expense.value),
    isEssential: Boolean(expense.isEssential),
    date: new Date(expense.date),
    createdAt: new Date(expense.createdAt),
    updatedAt: new Date(expense.updatedAt),
  };
}

@Injectable()
export class DashboardEffects {
  dashboardGetAllData = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.getAllDataStart),
      concatMap(() =>
        this.http
          .get<{ categories: Category[] }>(`${environment.apiUrl}/categories`)
          .pipe(
            map((response) => {
              response.categories = response.categories.map((category) =>
                normalizeCategory(category)
              );
              return response;
            })
          )
      ),
      concatMap((response) =>
        this.http
          .get<{ revenues: Revenue[] }>(`${environment.apiUrl}/revenues`)
          .pipe(
            map((revenuesResponse) => {
              revenuesResponse.revenues = revenuesResponse.revenues.map(
                (revenue) => normalizeRevenue(revenue)
              );
              return { ...response, ...revenuesResponse };
            })
          )
      ),
      concatMap((response) =>
        this.http
          .get<{ expenses: Expense[] }>(`${environment.apiUrl}/expenses`)
          .pipe(
            map((expensesResponse) => {
              expensesResponse.expenses = expensesResponse.expenses.map(
                (expense) => normalizeExpense(expense)
              );
              return { ...response, ...expensesResponse };
            })
          )
      ),
      concatMap((response) =>
        this.http.get<{ goals: Goal[] }>(`${environment.apiUrl}/goals`).pipe(
          map((goalsResponse) => {
            goalsResponse.goals = goalsResponse.goals.map((goal) =>
              normalizeGoal(goal)
            );
            return { ...response, ...goalsResponse };
          })
        )
      ),
      map((response) => DashboardActions.getAllDataSuccess({ ...response })),
      catchError(handleError.bind(this))
    )
  );

  getRevenues = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.getRevenuesStart),
      mergeMap((queryParams) => {
        const params = getHttpParams({ ...queryParams });
        return this.http
          .get<{ revenues: Revenue[] }>(`${environment.apiUrl}/revenues`, {
            params,
          })
          .pipe(
            map((response) => {
              let revenues = response.revenues;
              revenues = revenues.map((revenue) => normalizeRevenue(revenue));
              return DashboardActions.getRevenuesSuccess({
                revenues,
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  createRevenue = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.createRevenueStart),
      mergeMap((revenueData) => {
        const { value, date, description } = revenueData;
        return this.http
          .post<{ revenue: Revenue }>(`${environment.apiUrl}/revenues`, {
            value,
            description,
            date,
          })
          .pipe(
            map((response) => {
              const revenue = response.revenue;
              return DashboardActions.createRevenueSuccess({
                revenue: normalizeRevenue(revenue),
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updateRevenue = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.updateRevenueStart),
      mergeMap((revenueData) => {
        const { newValue, newDescription, newDate, revenueId } = revenueData;
        return this.http
          .patch<{ revenue: Revenue }>(
            `${environment.apiUrl}/revenues/${revenueId}`,
            {
              value: newValue,
              date: newDate,
              description: newDescription,
            }
          )
          .pipe(
            map((response) => {
              const revenue = response.revenue;
              return DashboardActions.updateRevenueSuccess({
                revenue: normalizeRevenue(revenue),
                revenueId,
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  deleteRevenue = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.deleteRevenueStart),
      mergeMap((revenueData) => {
        const { revenueId } = revenueData;
        return this.http
          .delete<{ revenue: Revenue }>(
            `${environment.apiUrl}/revenues/${revenueId}`
          )
          .pipe(
            map(() => DashboardActions.deleteRevenueSuccess({ revenueId })),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  getGoals = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.getGoalsStart),
      mergeMap((queryParams) => {
        const params = getHttpParams({ ...queryParams });
        return this.http
          .get<{ goals: Goal[] }>(`${environment.apiUrl}/goals`, {
            params,
          })
          .pipe(
            map((response) => {
              let goals = response.goals;
              goals = goals.map((goal) => normalizeGoal(goal));
              return DashboardActions.getGoalsSuccess({
                goals,
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  createGoal = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.createGoalStart),
      mergeMap((goalData) => {
        const { value, categoryId, essentialExpenses } = goalData;
        return this.http
          .post<{ goal: Goal }>(`${environment.apiUrl}/goals`, {
            value,
            categoryId,
            essentialExpenses,
          })
          .pipe(
            map((response) => {
              const goal = response.goal;
              return DashboardActions.createGoalSuccess({
                goal: normalizeGoal(goal),
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updateGoal = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.updateGoalStart),
      mergeMap((goalData) => {
        const { newValue, newCategoryId, essentialExpenses, goalId } = goalData;
        return this.http
          .patch<{ goal: Goal }>(`${environment.apiUrl}/goals/${goalId}`, {
            value: newValue,
            categoryId: newCategoryId,
            essentialExpenses,
          })
          .pipe(
            map((response) => {
              const goal = response.goal;
              return DashboardActions.updateGoalSuccess({
                goal: normalizeGoal(goal),
                goalId,
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  deleteGoal = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.deleteGoalStart),
      mergeMap((goalData) => {
        const { goalId } = goalData;
        return this.http
          .delete<{ goal: Goal }>(`${environment.apiUrl}/goals/${goalData}`)
          .pipe(
            map(() => DashboardActions.deleteGoalSuccess({ goalId })),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  getExpenses = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.getExpensesStart),
      mergeMap((queryParams) => {
        const params = getHttpParams({ ...queryParams });
        return this.http
          .get<{ expenses: Expense[] }>(`${environment.apiUrl}/expenses`, {
            params,
          })
          .pipe(
            map((response) => {
              let expenses = response.expenses;
              expenses = expenses.map((expense) => normalizeExpense(expense));
              return DashboardActions.getExpensesSuccess({
                expenses,
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  createExpense = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.createExpenseStart),
      mergeMap((expenseData) => {
        const { value, categoryId, date, description, isEssential } =
          expenseData;
        return this.http
          .post<{ expense: Expense }>(`${environment.apiUrl}/expenses`, {
            value,
            categoryId,
            date,
            description,
            isEssential,
          })
          .pipe(
            map((response) => {
              const expense = response.expense;
              return DashboardActions.createExpenseSuccess({
                expense: normalizeExpense(expense),
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updateExpense = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.updateExpenseStart),
      mergeMap((expenseData) => {
        const {
          newValue,
          newCategoryId,
          newDescription,
          newDate,
          isEssential,
          expenseId,
        } = expenseData;
        return this.http
          .patch<{ expense: Expense }>(
            `${environment.apiUrl}/expenses/${expenseId}`,
            {
              value: newValue,
              categoryId: newCategoryId,
              description: newDescription,
              date: newDate,
              isEssential,
            }
          )
          .pipe(
            map((response) => {
              const expense = response.expense;
              return DashboardActions.updateExpenseSuccess({
                expense: normalizeExpense(expense),
                expenseId,
              });
            }),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  deleteExpense = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.deleteExpenseStart),
      mergeMap((expenseData) => {
        const { expenseId } = expenseData;
        return this.http
          .delete<{ expense: Expense }>(
            `${environment.apiUrl}/expenses/${expenseId}`
          )
          .pipe(
            map(() => DashboardActions.deleteExpenseSuccess({ expenseId })),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  constructor(private $actions: Actions, private http: HttpClient) {}
}
