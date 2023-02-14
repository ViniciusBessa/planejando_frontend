import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserData } from '../shared/models/user.model';
import * as fromApp from '../store/app.reducer';
import * as UserAccountActions from './store/user-account.actions';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
})
export class UserAccountComponent implements OnInit {
  user!: UserData;
  loading: boolean = false;
  showPassword: boolean = false;
  selectedSection: UserSettingsSection = UserSettingsSection.Account;

  nameForm!: FormGroup;

  emailForm!: FormGroup;

  passwordForm!: FormGroup;

  accountDeleteForm!: FormGroup;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.initForms();

    this.store.select('auth').subscribe((state) => {
      this.user = state.user as UserData;
      this.updateForms();
    });

    this.store.select('userAccount').subscribe((state) => {
      this.loading = state.loading;
    });
  }

  private initForms() {
    // Initializing the forms
    this.nameForm = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
      ]),
    });

    this.emailForm = new FormGroup({
      email: new FormControl<string>('', [
        Validators.email,
        Validators.required,
      ]),
    });

    this.passwordForm = new FormGroup(
      {
        password: new FormControl<string>('', [Validators.required]),
        passwordConfirmation: new FormControl<string>('', [
          Validators.required,
        ]),
      },
      this.passwordsMatch
    );

    this.accountDeleteForm = new FormGroup({
      password: new FormControl<string>('', [Validators.required]),
    });
  }

  onSelectSection(section: string): void {
    this.showPassword = false;

    switch (section) {
      case 'password':
        this.selectedSection = UserSettingsSection.Password;
        break;

      default:
        this.selectedSection = UserSettingsSection.Account;
        break;
    }
  }

  onTogglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onUpdateName(): void {
    if (!this.nameForm.valid) return;

    const { name } = this.nameForm.value;

    // If the name provided is equal to the current user's name
    if (name == this.user.name) return;

    this.store.dispatch(UserAccountActions.updateNameStart({ newName: name! }));
  }

  onUpdateEmail(): void {
    if (!this.emailForm.valid) return;

    const { email } = this.emailForm.value;

    // If the email provided is equal to the current user's email
    if (email == this.user.email) return;

    this.store.dispatch(
      UserAccountActions.updateEmailStart({ newEmail: email! })
    );
  }

  onUpdatePassword(): void {
    if (!this.passwordForm.valid) return;

    const { password } = this.passwordForm.value;

    this.store.dispatch(
      UserAccountActions.updatePasswordStart({ newPassword: password! })
    );
  }

  onDeleteAccount(): void {
    if (!this.accountDeleteForm.valid) return;

    const { password } = this.accountDeleteForm.value;

    this.store.dispatch(UserAccountActions.deleteAccountStart({ password }));
  }

  private updateForms(): void {
    // Defaulting the values of the form to the user's data
    this.nameForm.patchValue({ name: this.user.name });
    this.emailForm.patchValue({ email: this.user.email });
  }

  private passwordsMatch(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')!;
    const passwordConfirmation = form.get('passwordConfirmation')!;

    if (password.value !== passwordConfirmation.value) {
      return { passwordsDontMatch: true };
    }
    return null;
  }

  get nameMinLength(): string | undefined {
    const name = this.nameForm.get('name') as FormControl;

    if (!name.errors) return;

    return name.errors!['minlength'].requiredLength as string;
  }

  get nameMaxLength(): string | undefined {
    const name = this.nameForm.get('name') as FormControl;

    if (!name.errors) return;

    return name.errors!['maxlength'].requiredLength as string;
  }
}

export enum UserSettingsSection {
  Account = 'ACCOUNT',
  Password = 'PASSWORD',
}
