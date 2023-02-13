import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AnimationState } from '../models/animation-state.enum';
import { Expense } from '../models/expense.model';
import * as fromApp from '../../store/app.reducer';
import * as DashboardActions from '../store/dashboard.actions';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
  animations: [
    trigger('rowAnimation', [
      transition('void => creatingexpense', [
        style({ position: 'relative', left: '-40px', opacity: 0 }),
        animate(1000, style({ left: '0px', opacity: 1 })),
      ]),

      transition('deletingexpense => void', [
        style({
          position: 'relative',
          left: '0px',
          opacity: 1,
        }),
        animate(1000, style({ opacity: 0, left: '40px' })),
      ]),

      transition('void => updatingexpense', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ExpensesComponent implements OnInit, AfterViewInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  tableDataSource = new MatTableDataSource<Expense>(this.expenses);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  minValue?: number;
  maxValue?: number;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
  isEssential?: boolean | string;
  categoryId?: number | string;

  selectedExpense: Expense | null = null;

  editingForm!: FormGroup;

  showEditingForm: boolean = false;
  animationState?: AnimationState;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.categories = state.categories;
      this.expenses = state.expenses;
      this.tableDataSource.data = this.expenses;
    });

    this.initEditingForm();
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  onSelectExpense(index: number): void {
    if (index < 0 || index >= this.expenses.length) return;

    this.selectedExpense = this.expenses[index];
    this.editingForm.patchValue({ ...this.selectedExpense });
    this.showEditingForm = true;
  }

  onOpenEditingForm(): void {
    this.selectedExpense = null;
    this.showEditingForm = true;
    this.editingForm.reset({
      isEssential: false,
      categoryId: this.categories[0].id || 0,
    });
  }

  onCloseEditingForm(): void {
    this.selectedExpense = null;
    this.showEditingForm = false;
    this.editingForm.reset({
      isEssential: false,
      categoryId: this.categories[0].id || 0,
    });
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

  onSubmit(): void {
    if (!this.editingForm.valid) return;

    const { value, date, description, isEssential, categoryId } =
      this.editingForm.value;

    if (this.selectedExpense) {
      this.onUpdateExpense(
        this.selectedExpense.id,
        (value as number) || undefined,
        (description as string) || undefined,
        (date as Date) || undefined,
        isEssential,
        Number(categoryId)
      );
    } else {
      this.onCreateExpense(
        value as number,
        Number(categoryId),
        description as string,
        (date as Date) || undefined,
        isEssential
      );
    }

    // Closing the form
    this.onCloseEditingForm();
  }

  onCreateExpense(
    value: number,
    categoryId: number,
    description: string,
    date?: Date,
    isEssential?: boolean
  ): void {
    this.startRowAnimation(AnimationState.CREATING);

    this.store.dispatch(
      DashboardActions.createExpenseStart({
        value,
        date,
        description,
        categoryId,
        isEssential,
      })
    );

    this.sortTableByDate();
  }

  onUpdateExpense(
    expenseId: number,
    newValue?: number,
    newDescription?: string,
    newDate?: Date,
    isEssential?: boolean,
    newCategoryId?: number
  ): void {
    this.startRowAnimation(AnimationState.UPDATING);

    this.store.dispatch(
      DashboardActions.updateExpenseStart({
        newValue,
        newDescription,
        newDate,
        expenseId,
        newCategoryId,
        isEssential,
      })
    );
  }

  onDeleteExpense(id: number): void {
    this.startRowAnimation(AnimationState.DELETING);

    this.store.dispatch(
      DashboardActions.deleteExpenseStart({
        expenseId: id,
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

  private validCategory(control: AbstractControl): ValidationErrors | null {
    if (this.categories) return null;

    const categoryId = control.value as number;
    const category = (this.categories as Category[]).find(
      (category) => category.id === categoryId
    );

    if (!category) {
      return { invalidCategory: 'A categoria selecionada é inválida' };
    }
    return null;
  }

  private initEditingForm(): void {
    this.editingForm = new FormGroup({
      value: new FormControl<number>(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(99999999999999),
      ]),

      categoryId: new FormControl<number>(0, [
        Validators.required,
        this.validCategory.bind(this),
      ]),

      isEssential: new FormControl<boolean>(false),

      date: new FormControl<Date>(new Date()),

      description: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
    });
  }

  get currentAnimationState(): string {
    switch (this.animationState) {
      case AnimationState.CREATING:
        return 'creatingexpense';
      case AnimationState.UPDATING:
        return 'updatingexpense';
      case AnimationState.DELETING:
        return 'deletingexpense';
      default:
        return '';
    }
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

  get displayedColumns(): string[] {
    return [
      'id',
      'description',
      'value',
      'category',
      'isEssential',
      'date',
      'actions',
    ];
  }
}
