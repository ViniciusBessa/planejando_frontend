import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { GoogleAuthenticationService } from '../services/google-authentication.service';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(40),
    ]),
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private googleAuthentication: GoogleAuthenticationService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((state) => {
      this.loading = state.loading;
    });
  }

  onTogglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { name, email, password } = this.form.value;

    this.store.dispatch(
      AuthActions.registerStart({
        name: name!,
        email: email!,
        password: password!,
        profile_image: '',
        next: null,
      })
    );
  }

  async onRegisterWithGoogle(): Promise<void> {
    const userData = await this.googleAuthentication.initLogin();

    this.store.dispatch(
      AuthActions.registerStart({
        name: userData.info.name,
        email: userData.info.email,
        password: userData.info.sub,
        profile_image: userData.picture,
        next: null,
      })
    );
  }
}
