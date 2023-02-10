import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

@Injectable()
export class DashboardEffects {
  dashboardGetAllData = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.getAllDataStart),
      concatMap(() =>
        this.http.get<{ categories: Category[] }>(
          `${environment.apiUrl}/categories`
        )
      ),
      concatMap((response) =>
        this.http
          .get<{ revenues: Revenue[] }>(`${environment.apiUrl}/revenues`)
          .pipe(
            map((revenuesResponse) => ({ ...response, ...revenuesResponse }))
          )
      ),
      concatMap((response) =>
        this.http
          .get<{ expenses: Expense[] }>(`${environment.apiUrl}/expenses`)
          .pipe(
            map((expensesResponse) => ({ ...response, ...expensesResponse }))
          )
      ),
      concatMap((response) =>
        this.http
          .get<{ goals: Goal[] }>(`${environment.apiUrl}/goals`)
          .pipe(map((goalsResponse) => ({ ...response, ...goalsResponse })))
      ),
      map((response) => DashboardActions.getAllDataSuccess({ ...response })),
      catchError(handleError.bind(this))
    )
  );

  createRevenue = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.createRevenueStart),
      mergeMap((revenueData) => {
        const { value } = revenueData;
        return this.http
          .post<{ revenue: Revenue }>(`${environment.apiUrl}/revenues`, {
            value,
          })
          .pipe(
            map((response) =>
              DashboardActions.createRevenueSuccess({ ...response })
            ),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updateRevenue = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.updateRevenueStart),
      mergeMap((revenueData) => {
        const { newValue, revenueId } = revenueData;
        return this.http
          .patch<{ revenue: Revenue }>(
            `${environment.apiUrl}/revenues/${revenueId}`,
            {
              value: newValue,
            }
          )
          .pipe(
            map((response) =>
              DashboardActions.updateRevenueSuccess({ ...response, revenueId })
            ),
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
            map((response) =>
              DashboardActions.createGoalSuccess({ ...response })
            ),
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
            map((response) =>
              DashboardActions.updateGoalSuccess({ ...response, goalId })
            ),
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

  createExpense = createEffect(() =>
    this.$actions.pipe(
      ofType(DashboardActions.createExpenseStart),
      mergeMap((expenseData) => {
        const { value, categoryId, description, isEssential } = expenseData;
        return this.http
          .post<{ expense: Expense }>(`${environment.apiUrl}/expenses`, {
            value,
            categoryId,
            description,
            isEssential,
          })
          .pipe(
            map((response) =>
              DashboardActions.createExpenseSuccess({ ...response })
            ),
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
              isEssential,
            }
          )
          .pipe(
            map((response) =>
              DashboardActions.updateExpenseSuccess({ ...response, expenseId })
            ),
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
