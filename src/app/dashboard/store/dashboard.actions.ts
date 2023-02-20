import { createAction, props } from '@ngrx/store';
import { Category } from '../models/category.model';
import { Expense } from '../models/expense.model';
import { Goal } from '../models/goal.model';
import { Revenue } from '../models/revenue.model';

export const getAllDataStart = createAction('[Dashboard] Get All Data Start');

export const getAllDataSuccess = createAction(
  '[Dashboard] Get All Data Success',
  props<{
    revenues: Revenue[];
    expenses: Expense[];
    goals: Goal[];
  }>()
);

export const getCategoriesStart = createAction(
  '[Dashboard] Get Categories Start'
);

export const getCategoriesSuccess = createAction(
  '[Dashboard] Get Categories Success',
  props<{
    categories: Category[];
  }>()
);

export const getRevenuesStart = createAction(
  '[Dashboard] Get Revenues Start',
  props<{
    minValue?: number;
    maxValue?: number;
    minDate?: Date;
    maxDate?: Date;
    description?: string;
  }>()
);

export const getRevenuesSuccess = createAction(
  '[Dashboard] Get Revenues Success',
  props<{
    revenues: Revenue[];
  }>()
);

export const createRevenueStart = createAction(
  '[Dashboard] Create Revenue Start',
  props<{ value: number; date?: Date; description: string }>()
);

export const createRevenueSuccess = createAction(
  '[Dashboard] Create Revenue Success',
  props<{ revenue: Revenue }>()
);

export const updateRevenueStart = createAction(
  '[Dashboard] Update Revenue Start',
  props<{
    newValue?: number;
    newDate?: Date;
    newDescription?: string;
    revenueId: number;
  }>()
);

export const updateRevenueSuccess = createAction(
  '[Dashboard] Update Revenue Success',
  props<{ revenue: Revenue; revenueId: number }>()
);

export const deleteRevenueStart = createAction(
  '[Dashboard] Delete Revenue Start',
  props<{ revenueId: number }>()
);

export const deleteRevenueSuccess = createAction(
  '[Dashboard] Delete Revenue Success',
  props<{ revenueId: number }>()
);

export const getGoalsStart = createAction(
  '[Dashboard] Get Goals Start',
  props<{
    minValue?: number;
    maxValue?: number;
    startDate?: Date;
    endDate?: Date;
    categoryId?: number;
    essentialExpenses?: boolean;
  }>()
);

export const getGoalsSuccess = createAction(
  '[Dashboard] Get Goals Success',
  props<{
    goals: Goal[];
  }>()
);

export const createGoalStart = createAction(
  '[Dashboard] Create Goal Start',
  props<{ value: number; categoryId: number; essentialExpenses?: boolean }>()
);

export const createGoalSuccess = createAction(
  '[Dashboard] Create Goal Success',
  props<{ goal: Goal }>()
);

export const updateGoalStart = createAction(
  '[Dashboard] Update Goal Start',
  props<{
    newValue?: number;
    newCategoryId?: number;
    essentialExpenses?: boolean;
    goalId: number;
  }>()
);

export const updateGoalSuccess = createAction(
  '[Dashboard] Update Goal Success',
  props<{ goal: Goal; goalId: number }>()
);

export const deleteGoalStart = createAction(
  '[Dashboard] Delete Goal Start',
  props<{ goalId: number }>()
);

export const deleteGoalSuccess = createAction(
  '[Dashboard] Delete Goal Success',
  props<{ goalId: number }>()
);

export const getExpensesStart = createAction(
  '[Dashboard] Get Expenses Start',
  props<{
    minValue?: number;
    maxValue?: number;
    minDate?: Date;
    maxDate?: Date;
    categoryId?: number;
    isEssential?: boolean;
    description?: string;
  }>()
);

export const getExpensesSuccess = createAction(
  '[Dashboard] Get Expenses Success',
  props<{
    expenses: Expense[];
  }>()
);

export const createExpenseStart = createAction(
  '[Dashboard] Create Expense Start',
  props<{
    value: number;
    description: string;
    date?: Date;
    isEssential?: boolean;
    categoryId: number;
  }>()
);

export const createExpenseSuccess = createAction(
  '[Dashboard] Create Expense Success',
  props<{ expense: Expense }>()
);

export const updateExpenseStart = createAction(
  '[Dashboard] Update Expense Start',
  props<{
    newValue?: number;
    newDescription?: string;
    newDate?: Date;
    isEssential?: boolean;
    newCategoryId?: number;
    expenseId: number;
  }>()
);

export const updateExpenseSuccess = createAction(
  '[Dashboard] Update Expense Success',
  props<{ expense: Expense; expenseId: number }>()
);

export const deleteExpenseStart = createAction(
  '[Dashboard] Delete Expense Start',
  props<{ expenseId: number }>()
);

export const deleteExpenseSuccess = createAction(
  '[Dashboard] Delete Expense Success',
  props<{ expenseId: number }>()
);

export const dashboardFail = createAction(
  '[Dashboard] Dashboard Fail',
  props<{ error: Error }>()
);

export const resetError = createAction('[Dashboard] Reset Error');
