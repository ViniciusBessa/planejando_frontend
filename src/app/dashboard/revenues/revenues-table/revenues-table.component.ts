import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AnimationState } from '../../models/animation-state.enum';
import { Revenue } from '../../models/revenue.model';
import * as fromApp from '../../../store/app.reducer';
import * as DashboardActions from '../../store/dashboard.actions';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-revenues-table',
  templateUrl: './revenues-table.component.html',
  styleUrls: ['./revenues-table.component.css'],
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
export class RevenuesTableComponent implements OnInit, AfterViewInit {
  revenues: Revenue[] = [];
  tableDataSource = new MatTableDataSource<Revenue>(this.revenues);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedRevenue: Revenue | null = null;

  form!: FormGroup;

  showForm: boolean = false;
  animationState?: AnimationState;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.revenues = state.revenues;
      this.tableDataSource.data = this.revenues;

      setTimeout(() => (this.animationState = undefined), 1000);
    });

    this.initForm();

    this.route.queryParams.subscribe((params: Params) => {
      const revenueId = params['revenueId'];

      if (revenueId) {
        this.onSelectRevenue(Number(revenueId));
      }
    });
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  onSelectRevenue(index: number): void {
    if (index < 0 || index >= this.revenues.length) return;

    this.selectedRevenue = this.revenues[index];
    this.showForm = true;
    this.form.patchValue({ ...this.selectedRevenue });
  }

  onOpenForm(): void {
    this.selectedRevenue = null;
    this.showForm = true;
    this.form.reset();
  }

  onCloseForm(): void {
    this.selectedRevenue = null;
    this.showForm = false;
    this.form.reset();
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { value, date, description } = this.form.value;

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
    this.onCloseForm();
  }

  onCreateRevenue(value: number, description: string, date?: Date): void {
    this.animationState = AnimationState.CREATING;

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
    this.animationState = AnimationState.UPDATING;

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
    this.animationState = AnimationState.DELETING;

    this.store.dispatch(
      DashboardActions.deleteRevenueStart({
        revenueId: id,
      })
    );
  }

  private initForm() {
    this.form = new FormGroup({
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
  }

  private sortTableByDate(): void {
    const sort = this.tableDataSource.sort as MatSort;
    sort.sort({ id: 'date', start: 'desc', disableClear: true });
    this.tableDataSource.sort = sort;
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

  get displayedColumns(): string[] {
    return ['id', 'description', 'value', 'date', 'actions'];
  }

  get valueMin(): string | undefined {
    const value = this.form.get('value') as FormControl;

    if (!value.errors) return;

    return value.errors!['min'].min as string;
  }

  get valueMax(): string | undefined {
    const value = this.form.get('value') as FormControl;

    if (!value.errors) return;

    return value.errors!['max'].max as string;
  }

  get descriptionMaxLength(): string | undefined {
    const description = this.form.get('description') as FormControl;

    if (!description.errors) return;

    return description.errors!['maxlength'].requiredLength as string;
  }
}
