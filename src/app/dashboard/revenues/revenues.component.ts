import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Revenue } from '../models/revenue.model';
import * as fromApp from '../../store/app.reducer';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as DashboardActions from '../store/dashboard.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnimationState } from '../models/animation-state.enum';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.css'],
  animations: [
    trigger('rowAnimation', [
      transition('void => creatingRevenue', [
        style({ position: 'relative', left: '-40px', opacity: 0 }),
        animate(1000, style({ left: '0px', opacity: 1 })),
      ]),

      transition('deletingRevenue => void', [
        style({
          position: 'relative',
          left: '0px',
          opacity: 1,
        }),
        animate(1000, style({ opacity: 0, left: '40px' })),
      ]),

      transition('void => updatingRevenue', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class RevenuesComponent implements OnInit, AfterViewInit {
  revenues: Revenue[] = [];
  tableDataSource = new MatTableDataSource<Revenue>(this.revenues);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  minValue?: number;
  maxValue?: number;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;

  selectedRevenue: Revenue | null = null;

  editingForm = new FormGroup({
    value: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999999999),
    ]),

    date: new FormControl<Date>(new Date()),

    description: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
  });

  showEditingForm: boolean = false;
  animationState?: AnimationState;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.revenues = state.revenues;
      this.tableDataSource.data = this.revenues;
    });
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  onSelectRevenue(index: number): void {
    if (index < 0 || index >= this.revenues.length) return;

    this.selectedRevenue = this.revenues[index];
    this.editingForm.patchValue({ ...this.selectedRevenue });
    this.showEditingForm = true;
  }

  onOpenEditingForm(): void {
    this.selectedRevenue = null;
    this.showEditingForm = true;
    this.editingForm.reset();
  }

  onCloseEditingForm(): void {
    this.selectedRevenue = null;
    this.showEditingForm = false;
    this.editingForm.reset();
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

  onSubmit(): void {
    if (!this.editingForm.valid) return;

    const { value, date, description } = this.editingForm.value;

    if (this.selectedRevenue) {
      this.onUpdateRevenue(
        this.selectedRevenue.id,
        (value as number) || undefined,
        (description as string) || undefined,
        (date as Date) || undefined
      );
    } else {
      this.onCreateRevenue(
        value as number,
        description as string,
        (date as Date) || undefined
      );
    }

    // Closing the form
    this.onCloseEditingForm();
  }

  onCreateRevenue(value: number, description: string, date?: Date): void {
    this.startRowAnimation(AnimationState.CREATING);

    this.store.dispatch(
      DashboardActions.createRevenueStart({
        value,
        date,
        description,
      })
    );

    this.sortTableByDate();
  }

  onUpdateRevenue(
    revenueId: number,
    newValue?: number,
    newDescription?: string,
    newDate?: Date
  ): void {
    this.startRowAnimation(AnimationState.UPDATING);

    this.store.dispatch(
      DashboardActions.updateRevenueStart({
        newValue,
        newDescription,
        newDate,
        revenueId,
      })
    );
  }

  onDeleteRevenue(id: number): void {
    this.startRowAnimation(AnimationState.DELETING);

    this.store.dispatch(
      DashboardActions.deleteRevenueStart({
        revenueId: id,
      })
    );
  }

  private sortTableByDate(): void {
    const sort = this.tableDataSource.sort as MatSort;
    sort.sort({ id: 'date', start: 'desc', disableClear: true });
    this.tableDataSource.sort = sort;
  }

  private startRowAnimation(state: AnimationState): void {
    this.animationState = state;
    setTimeout(() => (this.animationState = undefined), 1000);
  }

  get currentAnimationState(): string {
    switch (this.animationState) {
      case AnimationState.CREATING:
        return 'creatingRevenue';
      case AnimationState.UPDATING:
        return 'updatingRevenue';
      case AnimationState.DELETING:
        return 'deletingRevenue';
      default:
        return '';
    }
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

  get displayedColumns(): string[] {
    return ['id', 'description', 'value', 'date', 'actions'];
  }
}
