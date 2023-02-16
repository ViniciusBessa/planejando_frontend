import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Revenue } from '../models/revenue.model';
import * as fromApp from '../../store/app.reducer';
import * as DashboardActions from '../store/dashboard.actions';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.css'],
})
export class RevenuesComponent implements OnInit {
  revenues: Revenue[] = [];

  minValue?: number;
  maxValue?: number;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.revenues = state.revenues;
    });

    this.onGetRevenues();
  }

  onGetRevenues(): void {
    this.store.dispatch(
      DashboardActions.getRevenuesStart({
        description: this.searchQuery || undefined,
        minValue: this.minValue || undefined,
        maxValue: this.maxValue || undefined,
        minDate: this.startDate || undefined,
        maxDate: this.endDate || undefined,
      })
    );
  }

  get revenuesTotal(): number {
    const total = this.revenues.reduce(
      (total, revenue) => total + revenue.value,
      0
    );
    return Number(total.toFixed(2));
  }

  get revenuesLength(): number {
    return this.revenues.length;
  }

  get revenuesAverage(): number {
    return Number((this.revenuesTotal / this.revenuesLength).toFixed(2)) || 0;
  }
}
