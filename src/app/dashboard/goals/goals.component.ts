import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Category } from '../models/category.model';
import { Goal } from '../models/goal.model';
import * as DashboardActions from '../store/dashboard.actions';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  categories: Category[] = [];

  minValue?: number;
  maxValue?: number;
  startDate?: Date;
  endDate?: Date;
  essentialExpenses?: boolean | string;
  categoryId?: number | string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.goals = state.goals;
      this.categories = state.categories;
    });

    this.onGetGoals();
  }

  onGetGoals(): void {
    this.store.dispatch(
      DashboardActions.getGoalsStart({
        minValue: this.minValue || undefined,
        maxValue: this.maxValue || undefined,
        startDate: this.startDate || undefined,
        endDate: this.endDate || undefined,
        essentialExpenses:
          this.essentialExpenses !== 'undefined'
            ? (this.essentialExpenses as boolean)
            : undefined,
        categoryId:
          this.categoryId !== 'undefined'
            ? (this.categoryId as number)
            : undefined,
      })
    );
  }

  get goalsLength(): number {
    return this.goals.length;
  }

  get goalsNotAchieved(): number {
    return this.goals.filter((goal) => goal.sumExpenses >= goal.value).length;
  }

  get goalsInProgress(): number {
    return this.goals.filter((goal) => goal.sumExpenses < goal.value).length;
  }
}
