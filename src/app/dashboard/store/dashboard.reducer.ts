import { createReducer, on } from '@ngrx/store';
import { Category } from '../models/category.model';
import { Expense } from '../models/expense.model';
import { Goal } from '../models/goal.model';
import { Revenue } from '../models/revenue.model';
import * as DashboardActions from './dashboard.actions';

export interface State {
  categories: Category[];
  revenues: Revenue[];
  expenses: Expense[];
  goals: Goal[];
  error: Error | null;
  loading: boolean;
}

const initialState: State = {
  categories: [],
  revenues: [],
  expenses: [],
  goals: [],
  error: null,
  loading: false,
};

export const dashboardReducer = createReducer(
  initialState,

  on(
    DashboardActions.getAllDataStart,
    DashboardActions.getCategoriesStart,
    DashboardActions.getRevenuesStart,
    DashboardActions.getGoalsStart,
    DashboardActions.getExpensesStart,
    (state: State) => ({
      ...state,
      loading: true,
    })
  ),

  on(
    DashboardActions.getAllDataSuccess,
    (state: State, { revenues, expenses, goals }) => ({
      ...state,
      revenues,
      expenses,
      goals,
      loading: false,
    })
  ),

  on(DashboardActions.getCategoriesSuccess, (state: State, { categories }) => ({
    ...state,
    categories,
    loading: false,
  })),

  on(DashboardActions.getRevenuesSuccess, (state: State, { revenues }) => ({
    ...state,
    revenues,
    loading: false,
  })),

  on(DashboardActions.createRevenueSuccess, (state: State, { revenue }) => ({
    ...state,
    revenues: [...state.revenues, revenue],
  })),

  on(DashboardActions.updateRevenueSuccess, (state: State, { revenue }) => {
    let revenues = state.revenues;

    // Replacing the old revenue with the updated one
    revenues = revenues.map((currentRevenue) => {
      if (currentRevenue.id === revenue.id) {
        return revenue;
      }
      return currentRevenue;
    });
    return { ...state, revenues };
  }),

  on(DashboardActions.deleteRevenueSuccess, (state: State, { revenueId }) => {
    let revenues = state.revenues;

    // Filtering out the deleted revenue
    revenues = revenues.filter((currentRevenue) => {
      return revenueId !== currentRevenue.id;
    });
    return { ...state, revenues };
  }),

  on(DashboardActions.getGoalsSuccess, (state: State, { goals }) => ({
    ...state,
    goals,
    loading: false,
  })),

  on(DashboardActions.createGoalSuccess, (state: State, { goal }) => {
    const goals = state.goals;
    return { ...state, goals: [...state.goals, goal] };
  }),

  on(DashboardActions.updateGoalSuccess, (state: State, { goal }) => {
    let goals = state.goals;

    // Replacing the old goal with the updated one
    goals = goals.map((currentGoal) => {
      if (currentGoal.id === goal.id) {
        return goal;
      }
      return currentGoal;
    });
    return { ...state, goals };
  }),

  on(DashboardActions.deleteGoalSuccess, (state: State, { goalId }) => {
    let goals = state.goals;

    // Filtering out the deleted goal
    goals = goals.filter((currentGoal) => {
      return goalId !== currentGoal.id;
    });
    return { ...state, goals };
  }),

  on(DashboardActions.getExpensesSuccess, (state: State, { expenses }) => ({
    ...state,
    expenses,
    loading: false,
  })),

  on(DashboardActions.createExpenseSuccess, (state: State, { expense }) => {
    const expenses = state.expenses;
    return { ...state, expenses: [...state.expenses, expense] };
  }),

  on(DashboardActions.updateExpenseSuccess, (state: State, { expense }) => {
    let expenses = state.expenses;

    // Replacing the old expense with the updated one
    expenses = expenses.map((currentExpense) => {
      if (currentExpense.id === expense.id) {
        return expense;
      }
      return currentExpense;
    });
    return { ...state, expenses };
  }),

  on(DashboardActions.deleteExpenseSuccess, (state: State, { expenseId }) => {
    let expenses = state.expenses;

    // Filtering out the deleted expense
    expenses = expenses.filter((currentExpense) => {
      return expenseId !== currentExpense.id;
    });
    return { ...state, expenses };
  }),

  on(DashboardActions.dashboardFail, (state: State, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(DashboardActions.resetError, (state: State) => ({ ...state, error: null }))
);
