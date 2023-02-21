import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  bootstrapPencilFill,
  bootstrapTrash3Fill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import * as fromApp from '../../../store/app.reducer';
import localePt from '@angular/common/locales/pt';

import { GoalListComponent } from './goal-list.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { RouterTestingModule } from '@angular/router/testing';
import { GoalsGraphicsComponent } from '../goals-graphics/goals-graphics.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

describe('GoalListComponent', () => {
  let component: GoalListComponent;
  let fixture: ComponentFixture<GoalListComponent>;
  let compiled: HTMLElement;
  let store: Store;
  const initialState: fromApp.AppState = {
    auth: {
      user: null,
      loading: false,
      error: null,
    },
    userAccount: {
      error: null,
      loading: false,
      message: null,
    },
    dashboard: {
      categories: [
        {
          id: 3,
          title: 'Finance',
          description: 'Category of financial matters',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Food',
          description: 'Category of food items',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      revenues: [],
      expenses: [],
      goals: [
        {
          id: 2,
          categoryId: 3,
          userId: 4,
          category: {
            id: 3,
            title: 'Finance',
            description: 'Category of financial matters',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          value: 200,
          essentialExpenses: true,
          sumExpenses: [{ month: 1, total: 400 }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          categoryId: 2,
          userId: 4,
          category: {
            id: 2,
            title: 'Food',
            description: 'Category of food items',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          value: 300,
          essentialExpenses: true,
          sumExpenses: [{ month: 1, total: 200 }],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [
        GoalListComponent,
        GoalsGraphicsComponent,
        SidebarComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        NgIconsModule.withIcons({
          bootstrapPencilFill,
          bootstrapTrash3Fill,
        }),
        NgxGaugeModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),

        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalListComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select an goal to update', fakeAsync(() => {
    spyOn(component, 'onSelectGoal').and.callThrough();

    const selectBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;

    selectBtn.click();
    tick();

    expect(component.onSelectGoal).toHaveBeenCalled();
    expect(component.selectedGoal).toBeTruthy();
    expect(component.form.valid).toBeTrue();
    expect(component.showForm).toBeTrue();
  }));

  it('should open the form', fakeAsync(() => {
    spyOn(component, 'onOpenForm').and.callThrough();

    const openFormBtn = compiled.querySelectorAll(
      'button'
    )[0] as HTMLButtonElement;

    openFormBtn.click();
    tick();

    expect(component.onOpenForm).toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.showForm).toBeTrue();
  }));

  it('should fail to create an goal by not providing a value', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateGoal');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({ categoryId: 2, description: 'Description' });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateGoal).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('essentialExpenses')!.valid).toBeTrue();
  }));

  it('should fail to create an goal by providing a value too big', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateGoal');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: 9999999999999999,
      categoryId: 2,
      description: 'Description',
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateGoal).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('essentialExpenses')!.valid).toBeTrue();
  }));

  it('should fail to create an goal by providing a negative value', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateGoal');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: -1,
      categoryId: 2,
      description: 'Description',
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateGoal).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('essentialExpenses')!.valid).toBeTrue();
  }));

  it('should fail to create an goal by not selecting a category', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateGoal');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: 100,
      categoryId: '',
      description: 'Description',
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateGoal).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeTrue();
    expect(component.form.get('categoryId')!.valid).toBeFalse();
    expect(component.form.get('essentialExpenses')!.valid).toBeTrue();
  }));

  it('should fail to create an goal by providing an invalid category', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateGoal');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: 100,
      categoryId: 10,
      description: 'Description',
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateGoal).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeTrue();
    expect(component.form.get('categoryId')!.valid).toBeFalse();
    expect(component.form.get('essentialExpenses')!.valid).toBeTrue();
  }));

  it('should successfully create an goal', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateGoal');
    spyOn(component, 'onCloseForm');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: 100,
      categoryId: 3,
      description: 'Description',
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCloseForm).toHaveBeenCalled();
    expect(component.onCreateGoal).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  }));

  it('should successfully update an goal', fakeAsync(() => {
    spyOn(component, 'onSelectGoal').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onUpdateGoal');
    spyOn(component, 'onCloseForm');

    // Selecting an goal
    let selectBtn = compiled.querySelectorAll('button')[1] as HTMLButtonElement;

    selectBtn.click();
    tick();
    fixture.detectChanges();

    // Updating the form
    component.form.patchValue({
      ...component.selectedGoal,
      value: 1000,
    });

    // Submitting the form
    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;

    submitBtn.click();
    tick();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCloseForm).toHaveBeenCalled();
    expect(component.onUpdateGoal).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  }));

  it('should successfully delete an goal', fakeAsync(() => {
    spyOn(component, 'onDeleteGoal').and.callThrough();
    spyOn(store, 'dispatch');

    const deleteBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;

    deleteBtn.click();
    tick();

    expect(component.onDeleteGoal).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();

    flush();
  }));
});
