import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import * as fromApp from '../../../store/app.reducer';

import { ExpensesTableComponent } from './expenses-table.component';
import { MatInputModule } from '@angular/material/input';
import {
  bootstrapPencilFill,
  bootstrapTrash3Fill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ExpensesTableComponent', () => {
  let component: ExpensesTableComponent;
  let fixture: ComponentFixture<ExpensesTableComponent>;
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
      expenses: [
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
          description: 'New expense',
          isEssential: false,
          date: new Date(),
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
          description: 'Food expense',
          isEssential: true,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      goals: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [ExpensesTableComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        NgIconsModule.withIcons({
          bootstrapPencilFill,
          bootstrapTrash3Fill,
        }),
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesTableComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select an expense to update', fakeAsync(() => {
    spyOn(component, 'onSelectExpense').and.callThrough();

    const selectBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;

    selectBtn.click();
    tick();

    expect(component.onSelectExpense).toHaveBeenCalled();
    expect(component.selectedExpense).toBeTruthy();
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

  it('should fail to create an expense by not providing a value', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({ categoryId: 2, description: 'Description' });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateExpense).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('isEssential')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an expense by providing a value too big', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');

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
    expect(component.onCreateExpense).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('isEssential')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an expense by providing a negative value', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');

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
    expect(component.onCreateExpense).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('isEssential')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an expense by not providing a description', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: 100,
      categoryId: 2,
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateExpense).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeTrue();
    expect(component.form.get('categoryId')!.valid).toBeTrue();
    expect(component.form.get('isEssential')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeFalse();
  }));

  it('should fail to create an expense by not selecting a category', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');

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
    expect(component.onCreateExpense).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeTrue();
    expect(component.form.get('categoryId')!.valid).toBeFalse();
    expect(component.form.get('isEssential')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an expense by providing an invalid category', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');

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
    expect(component.onCreateExpense).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeTrue();
    expect(component.form.get('categoryId')!.valid).toBeFalse();
    expect(component.form.get('isEssential')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should successfully create an expense', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateExpense');
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
    expect(component.onCreateExpense).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  }));

  it('should successfully update an expense', fakeAsync(() => {
    spyOn(component, 'onSelectExpense').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onUpdateExpense');
    spyOn(component, 'onCloseForm');

    // Selecting an expense
    let selectBtn = compiled.querySelectorAll('button')[1] as HTMLButtonElement;

    selectBtn.click();
    tick();
    fixture.detectChanges();

    // Updating the form
    component.form.patchValue({
      ...component.selectedExpense,
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
    expect(component.onUpdateExpense).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  }));

  it('should successfully delete an expense', fakeAsync(() => {
    spyOn(component, 'onDeleteExpense').and.callThrough();
    spyOn(store, 'dispatch');

    const deleteBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;

    deleteBtn.click();
    tick();

    expect(component.onDeleteExpense).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();

    flush();
  }));
});
