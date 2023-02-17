import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserData } from 'src/app/shared/models/user.model';
import { Expense } from '../models/expense.model';
import { Goal } from '../models/goal.model';
import { Revenue } from '../models/revenue.model';
import * as fromApp from '../../store/app.reducer';
import * as DashboardActions from '../store/dashboard.actions';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  user: UserData | null = null;
  revenues: Revenue[] = [];
  expenses: Expense[] = [];
  goals: Goal[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;

  chartThresholdConfig = {
    '0': { color: 'green' },
    '50': { color: 'orange' },
    '90': { color: 'red' },
  };

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.isLoading = state.loading;
      this.revenues = state.revenues;
      this.expenses = state.expenses;
      this.goals = state.goals;
      this.categories = state.categories;
    });

    this.store.select('auth').subscribe((state) => {
      this.user = state.user;
    });

    this.store.dispatch(DashboardActions.getAllDataStart());
  }

  goalGaugePercentage(goal: Goal): number {
    const percentage = (goal.sumExpenses / goal.value) * 100;
    return Number(percentage.toFixed(2));
  }

  getExpensesByCategory(category: Category): {
    category: Category;
    totalExpenses: number;
  } {
    const categoryExpenses = this.expenses.reduce((initial, expense) => {
      if (expense.category.id === category.id) {
        return initial + expense.value;
      }
      return initial;
    }, 0);

    return { category, totalExpenses: categoryExpenses };
  }

  getPercentageOfTotalExpenses(value: number) {
    const percentage = (value / this.sumExpenses) * 100;
    return Number(percentage.toFixed(2));
  }

  get monthlyRevenue(): number {
    // Getting the current year and month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Filtering the revenues of the current month
    const revenuesOfTheMonth = this.revenues.filter((revenue) => {
      const revenueYear = revenue.date.getFullYear();
      const revenueMonth = revenue.date.getMonth();
      return revenueYear === currentYear && revenueMonth === currentMonth;
    });

    // Calculating the sum of the revenues
    return revenuesOfTheMonth.reduce(
      (initial, expense) => initial + expense.value,
      0
    );
  }

  get monthlyExpense(): number {
    // Getting the current year and month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Filtering the expenses of the current month
    const expensesOfTheMonth = this.expenses.filter((expense) => {
      const expenseYear = expense.date.getFullYear();
      const expenseMonth = expense.date.getMonth();
      return expenseYear === currentYear && expenseMonth === currentMonth;
    });

    // Calculating the sum of the expenses
    return expensesOfTheMonth.reduce(
      (initial, expense) => initial + expense.value,
      0
    );
  }

  get monthlyBiggestExpenses(): {
    category: Category;
    totalExpenses: number;
  }[] {
    const expensesByCategory = [];

    for (let category of this.categories) {
      const totalExpensesOfCategory = this.getExpensesByCategory(category);

      if (totalExpensesOfCategory.totalExpenses > 0) {
        expensesByCategory.push(totalExpensesOfCategory);
      }
    }

    expensesByCategory.sort((totalA, totalB) => {
      if (totalA.totalExpenses < totalB.totalExpenses) {
        return 1;
      } else if (totalA.totalExpenses > totalB.totalExpenses) {
        return -1;
      }
      return 0;
    });

    return expensesByCategory.slice(0, 5);
  }

  get sumExpenses(): number {
    return this.expenses.reduce(
      (initial, expense) => initial + expense.value,
      0
    );
  }

  get firstFiveExpenses(): Expense[] {
    return this.expenses.slice(0, 5);
  }

  get firstFiveRevenues(): Revenue[] {
    return this.revenues.slice(0, 5);
  }

  get firstTwoGoals(): Goal[] {
    return this.goals.slice(0, 5);
  }
}
