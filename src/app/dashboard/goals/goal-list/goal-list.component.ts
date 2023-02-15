import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  ValidationErrors,
  FormControl,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AnimationState } from '../../models/animation-state.enum';
import { Category } from '../../models/category.model';
import * as fromApp from '../../../store/app.reducer';
import * as DashboardActions from '../../store/dashboard.actions';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css'],
  animations: [
    trigger('rowAnimation', [
      transition('void => creatingGoal', [
        style({ position: 'relative', left: '-40px', opacity: 0 }),
        animate(1000, style({ left: '0px', opacity: 1 })),
      ]),

      transition('deletingGoal => void', [
        style({
          position: 'relative',
          left: '0px',
          opacity: 1,
        }),
        animate(1000, style({ opacity: 0, left: '40px' })),
      ]),

      transition('void => updatingGoal', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class GoalListComponent implements OnInit {
  goals: Goal[] = [];
  categories: Category[] = [];

  selectedGoal: Goal | null = null;
  form!: FormGroup;

  showForm: boolean = false;
  animationState?: AnimationState;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.categories = state.categories;
      this.goals = state.goals;
    });

    this.initForm();
  }

  onSelectGoal(index: number): void {
    if (index < 0 || index >= this.goals.length) return;

    this.selectedGoal = this.goals[index];
    this.form.patchValue({ ...this.selectedGoal });
    this.showForm = true;
  }

  onOpenForm(): void {
    this.selectedGoal = null;
    this.showForm = true;
    this.form.reset({
      essentialExpenses: false,
      categoryId: this.categories[0].id || 0,
    });
  }

  onCloseForm(): void {
    this.selectedGoal = null;
    this.showForm = false;
    this.form.reset({
      essentialExpenses: false,
      categoryId: this.categories ? this.categories[0].id : undefined,
    });
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { value, essentialExpenses, categoryId } = this.form.value;

    if (this.selectedGoal) {
      this.onUpdateGoal(
        this.selectedGoal.id,
        (value as number) || undefined,
        essentialExpenses === 'true',
        Number(categoryId)
      );
    } else {
      this.onCreateGoal(
        value as number,
        Number(categoryId),
        essentialExpenses === 'true'
      );
    }

    // Closing the form
    this.onCloseForm();
  }

  onCreateGoal(
    value: number,
    categoryId: number,
    essentialExpenses?: boolean
  ): void {
    this.startRowAnimation(AnimationState.CREATING);

    this.store.dispatch(
      DashboardActions.createGoalStart({
        value,
        categoryId,
        essentialExpenses,
      })
    );
  }

  onUpdateGoal(
    goalId: number,
    newValue?: number,
    essentialExpenses?: boolean,
    newCategoryId?: number
  ): void {
    this.startRowAnimation(AnimationState.UPDATING);

    this.store.dispatch(
      DashboardActions.updateGoalStart({
        newValue,
        goalId,
        newCategoryId,
        essentialExpenses,
      })
    );
  }

  onDeleteGoal(id: number): void {
    this.startRowAnimation(AnimationState.DELETING);

    this.store.dispatch(
      DashboardActions.deleteGoalStart({
        goalId: id,
      })
    );
  }

  private startRowAnimation(state: AnimationState): void {
    this.animationState = state;
    setTimeout(() => (this.animationState = undefined), 1000);
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

      essentialExpenses: new FormControl<boolean>(false),
    });
  }

  get currentAnimationState(): string {
    switch (this.animationState) {
      case AnimationState.CREATING:
        return 'creatingGoal';
      case AnimationState.UPDATING:
        return 'updatingGoal';
      case AnimationState.DELETING:
        return 'deletingGoal';
      default:
        return '';
    }
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
