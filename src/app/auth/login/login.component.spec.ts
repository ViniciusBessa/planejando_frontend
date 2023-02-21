import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import * as fromApp from '../../store/app.reducer';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GoogleAuthenticationService } from '../services/google-authentication.service';
import { Location } from '@angular/common';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { RegisterComponent } from '../register/register.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;
  let store: Store;
  let googleAuthentication: GoogleAuthenticationService;
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
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth/cadastro', component: RegisterComponent },
          { path: 'auth/recuperar', component: PasswordResetComponent },
        ]),
        ReactiveFormsModule,
        OAuthModule.forRoot(),
        HttpClientModule,
        NgIconsModule.withIcons({
          bootstrapEyeFill,
          bootstrapEyeSlashFill,
        }),
      ],
      providers: [provideMockStore({ initialState: initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    googleAuthentication = fixture.debugElement.injector.get(
      GoogleAuthenticationService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fail to submit the form by not passing any data', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should fail to submit the form by not passing an email', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should fail to submit the form by passing an invalid email', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      email: '@email.com',
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should fail to submit the form by not passing a password', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      email: 'test@email.com',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should successfully submit the form', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(store, 'dispatch');

    component.form.patchValue({
      email: 'example@email.com',
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.valid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should successfully log in with a Google account', fakeAsync(() => {
    spyOn(component, 'onLogInWithGoogle').and.callThrough();
    spyOn(googleAuthentication, 'initLogin');

    const googleLogoIcon = compiled.querySelector('img') as HTMLImageElement;
    googleLogoIcon.click();
    tick();

    expect(component.onLogInWithGoogle).toHaveBeenCalled();
    expect(googleAuthentication.initLogin).toHaveBeenCalled();
  }));

  it('should toggle the password input type to text and then back to password', fakeAsync(() => {
    spyOn(component, 'onTogglePassword').and.callThrough();

    // Toggling the input type to text
    let eyeIcon = compiled.querySelector('ng-icon') as HTMLElement;
    eyeIcon.click();
    tick();
    fixture.detectChanges();

    const firstType = (
      compiled.querySelectorAll('input')[1] as HTMLInputElement
    ).type;

    // Toggling the input type back to password
    eyeIcon = compiled.querySelector('ng-icon') as HTMLElement;
    eyeIcon.click();
    tick();
    fixture.detectChanges();

    const secondType = (
      compiled.querySelectorAll('input')[1] as HTMLInputElement
    ).type;

    expect(firstType).toEqual('text');
    expect(secondType).toEqual('password');
    expect(component.onTogglePassword).toHaveBeenCalled();
  }));

  it('should navigate to the password reset page', fakeAsync(
    inject([Location], (location: Location) => {
      const anchorLogin = compiled.querySelectorAll(
        'a'
      )[0] as HTMLAnchorElement;
      anchorLogin.click();
      tick();

      expect(location.path()).toEqual('/auth/recuperar');
    })
  ));

  it('should navigate to the register page', fakeAsync(
    inject([Location], (location: Location) => {
      const anchorLogin = compiled.querySelectorAll(
        'a'
      )[1] as HTMLAnchorElement;
      anchorLogin.click();
      tick();

      expect(location.path()).toEqual('/auth/cadastro');
    })
  ));
});
