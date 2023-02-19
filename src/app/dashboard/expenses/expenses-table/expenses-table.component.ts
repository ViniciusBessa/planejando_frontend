import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  ValidationErrors,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AnimationState } from '../../models/animation-state.enum';
import { Category } from '../../models/category.model';
import { Expense } from '../../models/expense.model';
import * as fromApp from '../../../store/app.reducer';
import * as DashboardActions from '../../store/dashboard.actions';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.css'],
  animations: [
    trigger('rowAnimation', [
      transition('void => creatingExpense', [
        style({ position: 'relative', left: '-40px', opacity: 0 }),
        animate(1000, style({ left: '0px', opacity: 1 })),
      ]),

      transition('deletingExpense => void', [
        style({
          position: 'relative',
          left: '0px',
          opacity: 1,
        }),
        animate(1000, style({ opacity: 0, left: '40px' })),
      ]),

      transition('void => updatingExpense', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ExpensesTableComponent implements OnInit, AfterViewInit {
  expenses: Expense[] = [];
  categories: Category[] = [];
  tableDataSource = new MatTableDataSource<Expense>(this.expenses);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedExpense: Expense | null = null;
  form!: FormGroup;

  showForm: boolean = false;
  animationState?: AnimationState;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.categories = state.categories;
      this.expenses = state.expenses;
      this.tableDataSource.data = this.expenses;

      setTimeout(() => (this.animationState = undefined), 1000);
    });

    this.initForm();

    this.route.queryParams.subscribe((params: Params) => {
      const expenseId = params['expenseId'];

      if (expenseId) {
        this.onSelectExpense(Number(expenseId));
      }
    });
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  onSelectExpense(index: number): void {
    if (index < 0 || index >= this.expenses.length) return;

    this.selectedExpense = this.expenses[index];
    this.form.patchValue({ ...this.selectedExpense });
    this.showForm = true;
  }

  onOpenForm(): void {
    this.selectedExpense = null;
    this.showForm = true;
    this.form.reset({
      isEssential: false,
      categoryId: this.categories[0].id || 0,
    });
  }

  onCloseForm(): void {
    this.selectedExpense = null;
    this.showForm = false;
    this.form.reset({
      isEssential: false,
      categoryId: this.categories ? this.categories[0].id : undefined,
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { value, date, description, isEssential, categoryId } =
      this.form.value;

    if (this.selectedExpense) {
      this.onUpdateExpense(
        this.selectedExpense.id,
        (value as number) || undefined,
        (description as string) || undefined,
        (date as Date) || undefined,
        isEssential === 'true',
        Number(categoryId)
      );
    } else {
      this.onCreateExpense(
        value as number,
        Number(categoryId),
        description as string,
        (date as Date) || undefined,
        isEssential === 'true'
      );
    }

    // Closing the form
    this.onCloseForm();
  }

  onCreateExpense(
    value: number,
    categoryId: number,
    description: string,
    date?: Date,
    isEssential?: boolean
  ): void {
    this.animationState = AnimationState.CREATING;

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
    this.animationState = AnimationState.UPDATING;

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
    this.animationState = AnimationState.DELETING;

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

  private validCategory(control: AbstractControl): ValidationErrors | null {
    if (!this.categories) return null;

    const categoryId = Number(control.value);
    const category = (this.categories as Category[]).find(
      (category) => category.id === categoryId
    );

    if (!category) {
      return { invalidCategory: 'A categoria selecionada é inválida' };
    }
    return null;
  }

  private initForm(): void {
    this.form = new FormGroup({
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
        return 'creatingExpense';
      case AnimationState.UPDATING:
        return 'updatingExpense';
      case AnimationState.DELETING:
        return 'deletingExpense';
      default:
        return '';
    }
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
