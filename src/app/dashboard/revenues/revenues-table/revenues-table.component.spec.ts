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
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import localePt from '@angular/common/locales/pt';
import * as fromApp from '../../../store/app.reducer';

import { RevenuesTableComponent } from './revenues-table.component';
import {
  bootstrapPencilFill,
  bootstrapTrash3Fill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('RevenuesTableComponent', () => {
  let component: RevenuesTableComponent;
  let fixture: ComponentFixture<RevenuesTableComponent>;
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
      revenues: [
        {
          id: 2,
          userId: 4,
          value: 200,
          description: 'New revenue',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          userId: 4,
          value: 300,
          description: 'Food revenue',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      expenses: [],
      goals: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [RevenuesTableComponent],
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

    fixture = TestBed.createComponent(RevenuesTableComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select an revenue to update', fakeAsync(() => {
    spyOn(component, 'onSelectRevenue').and.callThrough();

    const selectBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;

    selectBtn.click();
    tick();

    expect(component.onSelectRevenue).toHaveBeenCalled();
    expect(component.selectedRevenue).toBeTruthy();
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

  it('should fail to create an revenue by not providing a value', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateRevenue');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({ categoryId: 2, description: 'Description' });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCreateRevenue).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an revenue by providing a value too big', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateRevenue');

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
    expect(component.onCreateRevenue).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an revenue by providing a negative value', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateRevenue');

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
    expect(component.onCreateRevenue).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeFalse();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeTrue();
  }));

  it('should fail to create an revenue by not providing a description', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateRevenue');

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
    expect(component.onCreateRevenue).not.toHaveBeenCalled();
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('value')!.valid).toBeTrue();
    expect(component.form.get('date')!.valid).toBeTrue();
    expect(component.form.get('description')!.valid).toBeFalse();
  }));

  it('should successfully create an revenue', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onCreateRevenue');
    spyOn(component, 'onCloseForm');

    component.onOpenForm();
    fixture.detectChanges();

    component.form.patchValue({
      value: 100,
      description: 'Description',
    });

    const allButtons = compiled.querySelectorAll('button');
    const submitBtn = allButtons[allButtons.length - 1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.onCloseForm).toHaveBeenCalled();
    expect(component.onCreateRevenue).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  }));

  it('should successfully update an revenue', fakeAsync(() => {
    spyOn(component, 'onSelectRevenue').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(component, 'onUpdateRevenue');
    spyOn(component, 'onCloseForm');

    // Selecting an revenue
    let selectBtn = compiled.querySelectorAll('button')[1] as HTMLButtonElement;

    selectBtn.click();
    tick();
    fixture.detectChanges();

    // Updating the form
    component.form.patchValue({
      ...component.selectedRevenue,
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
    expect(component.onUpdateRevenue).toHaveBeenCalled();
    expect(component.form.valid).toBeTrue();
  }));

  it('should successfully delete an revenue', fakeAsync(() => {
    spyOn(component, 'onDeleteRevenue').and.callThrough();
    spyOn(store, 'dispatch');

    const deleteBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;

    deleteBtn.click();
    tick();

    expect(component.onDeleteRevenue).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();

    flush();
  }));
});
