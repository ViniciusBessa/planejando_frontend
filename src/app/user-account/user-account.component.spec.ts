import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
  bootstrapHouse,
  bootstrapPersonCircle,
  bootstrapKeyFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as fromApp from '../store/app.reducer';

import {
  UserAccountComponent,
  UserSettingsSection,
} from './user-account.component';

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;
  let compiled: HTMLElement;
  let store: Store;
  let initialState: fromApp.AppState = {
    auth: {
      user: {
        id: 1,
        name: 'TestingUser',
        email: 'email@example.com',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      error: null,
      loading: false,
    },
    userAccount: {
      error: null,
      loading: false,
      message: null,
    },
    dashboard: {
      categories: [],
      revenues: [],
      expenses: [],
      goals: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountComponent],
      imports: [
        NgIconsModule.withIcons({
          bootstrapEyeFill,
          bootstrapEyeSlashFill,
          bootstrapHouse,
          bootstrapKeyFill,
          bootstrapPersonCircle,
        }),
        ReactiveFormsModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the account section by default', () => {
    expect(component.selectedSection).toEqual(UserSettingsSection.Account);
  });

  it("should display the user's name", () => {
    const nameHeader = compiled.querySelector('h2') as HTMLHeadingElement;
    expect(nameHeader.innerText).toEqual(component.user.name);
  });

  it("should not let the user submit the name form if the provided name is the account's current name", fakeAsync(() => {
    spyOn(component, 'onUpdateName').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.nameForm;

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[0] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateName).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it('should fail to submit the name form by not providing a new name', fakeAsync(() => {
    spyOn(component, 'onUpdateName').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.nameForm;

    form.patchValue({ name: '' });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[0] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateName).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should fail to submit the name form by providing a name too short', fakeAsync(() => {
    spyOn(component, 'onUpdateName').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.nameForm;

    form.patchValue({ name: 'Test' });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[0] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateName).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should fail to submit the name form by providing a name too long', fakeAsync(() => {
    spyOn(component, 'onUpdateName').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.nameForm;

    form.patchValue({ name: 'Test'.repeat(11) });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[0] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateName).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should successfully submit the name form', fakeAsync(() => {
    spyOn(component, 'onUpdateName').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.nameForm;

    form.patchValue({ name: 'NewTestingUser' });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[0] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateName).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it("should not let the user submit the email form if the provided email is the account's current email", fakeAsync(() => {
    spyOn(component, 'onUpdateEmail').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.emailForm;

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateEmail).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it('should fail to submit the email form by not providing a new email', fakeAsync(() => {
    spyOn(component, 'onUpdateEmail').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.emailForm;

    form.patchValue({ email: '' });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateEmail).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should fail to submit the email form by providing an invalid email', fakeAsync(() => {
    spyOn(component, 'onUpdateEmail').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.emailForm;

    form.patchValue({ email: 'email@' });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateEmail).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should successfully submit the email form', fakeAsync(() => {
    spyOn(component, 'onUpdateEmail').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.emailForm;

    form.patchValue({ email: 'newEmail@example.com' });

    fixture.detectChanges();

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdateEmail).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it('should fail to submit the account deletion form by not providing the password', fakeAsync(() => {
    spyOn(component, 'onDeleteAccount').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.accountDeleteForm;

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onDeleteAccount).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should successfully submit the account deletion form', fakeAsync(() => {
    spyOn(component, 'onDeleteAccount').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.accountDeleteForm;

    form.patchValue({ password: 'password' });

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onDeleteAccount).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it('should successfully submit the account deletion form', fakeAsync(() => {
    spyOn(component, 'onDeleteAccount').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.accountDeleteForm;

    form.patchValue({ password: 'password' });

    const submitBtn = compiled.querySelectorAll(
      'button'
    )[2] as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onDeleteAccount).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it('should select the password section and display the password redefinition form', fakeAsync(() => {
    spyOn(component, 'onSelectSection').and.callThrough();

    // Selecting the password section
    const keyIcon = compiled.querySelectorAll('ng-icon')[2] as HTMLElement;
    keyIcon.click();
    tick();

    expect(component.onSelectSection).toHaveBeenCalled();
    expect(component.selectedSection).toEqual(UserSettingsSection.Password);
  }));

  it('should fail to submit the password redefinition form by not providing a new password', fakeAsync(() => {
    spyOn(component, 'onUpdatePassword').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.passwordForm;

    // Selecting the password section
    const keyIcon = compiled.querySelectorAll('ng-icon')[2] as HTMLElement;
    keyIcon.click();
    tick();

    fixture.detectChanges();

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdatePassword).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should fail to submit the password redefinition form by not providing the password confirmation', fakeAsync(() => {
    spyOn(component, 'onUpdatePassword').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.passwordForm;

    form.patchValue({ password: 'password' });

    // Selecting the password section
    const keyIcon = compiled.querySelectorAll('ng-icon')[2] as HTMLElement;
    keyIcon.click();
    tick();

    fixture.detectChanges();

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdatePassword).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should fail to submit the password redefinition form by the new password and the password confirmation not matching', fakeAsync(() => {
    spyOn(component, 'onUpdatePassword').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.passwordForm;

    form.patchValue({
      password: 'password',
      passwordConfirmation: 'password2',
    });

    // Selecting the password section
    const keyIcon = compiled.querySelectorAll('ng-icon')[2] as HTMLElement;
    keyIcon.click();
    tick();

    fixture.detectChanges();

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdatePassword).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(form.valid).toBeFalse();
  }));

  it('should successfully submit the password redefinition form', fakeAsync(() => {
    spyOn(component, 'onUpdatePassword').and.callThrough();
    spyOn(store, 'dispatch');

    const form = component.passwordForm;

    form.patchValue({
      password: 'password',
      passwordConfirmation: 'password',
    });

    // Selecting the password section
    const keyIcon = compiled.querySelectorAll('ng-icon')[2] as HTMLElement;
    keyIcon.click();
    tick();

    fixture.detectChanges();

    // Submitting the form
    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.onUpdatePassword).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
    expect(form.valid).toBeTrue();
  }));

  it('should toggle the password visiblity', fakeAsync(() => {
    spyOn(component, 'onTogglePassword').and.callThrough();

    // Toggling the input type to text
    let eyeIcon = compiled.querySelectorAll('ng-icon')[3] as HTMLElement;
    eyeIcon.click();
    tick();
    fixture.detectChanges();

    const firstType = (
      compiled.querySelectorAll('input')[2] as HTMLInputElement
    ).type;

    // Toggling the input type back to password
    eyeIcon = compiled.querySelectorAll('ng-icon')[3] as HTMLElement;
    eyeIcon.click();
    tick();
    fixture.detectChanges();

    const secondType = (
      compiled.querySelectorAll('input')[2] as HTMLInputElement
    ).type;

    expect(firstType).toEqual('text');
    expect(secondType).toEqual('password');
    expect(component.onTogglePassword).toHaveBeenCalled();
  }));
});
