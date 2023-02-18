import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '../models/expense.model';
import * as fromApp from '../../store/app.reducer';
import * as DashboardActions from '../store/dashboard.actions';
import { Category } from '../models/category.model';
import { DashboardSection } from '../models/dashboard-sections.enum';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  selectedSection: DashboardSection = DashboardSection.TABLES;

  minValue?: number;
  maxValue?: number;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
  isEssential?: boolean | string;
  categoryId?: number | string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.expenses = state.expenses;
      this.categories = state.categories;
    });

    this.onGetExpenses();
  }

  onGetExpenses(): void {
    this.store.dispatch(
      DashboardActions.getExpensesStart({
        description: this.searchQuery || undefined,
        minValue: this.minValue || undefined,
        maxValue: this.maxValue || undefined,
        minDate: this.startDate || undefined,
        maxDate: this.endDate || undefined,
        isEssential:
          this.isEssential !== 'undefined'
            ? (this.isEssential as boolean)
            : undefined,
        categoryId:
          this.categoryId !== 'undefined'
            ? (this.categoryId as number)
            : undefined,
      })
    );
  }

  onSectionSelected(event: any): void {
    this.selectedSection = event;
  }

  get expensesTotal(): number {
    const total = this.expenses.reduce(
      (total, expense) => total + expense.value,
      0
    );
    return Number(total.toFixed(2));
  }

  get expensesLength(): number {
    return this.expenses.length;
  }

  get expensesAverage(): number {
    return Number((this.expensesTotal / this.expensesLength).toFixed(2)) || 0;
  }
}
