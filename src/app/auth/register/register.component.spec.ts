import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from './register.component';
import * as fromApp from '../../store/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { GoogleAuthenticationService } from '../services/google-authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleUserData } from '../services/google-user-data.model';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { Location } from '@angular/common';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
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
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: LoginComponent },
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = fixture.debugElement.injector.get(Store);
    googleAuthentication = fixture.debugElement.injector.get(
      GoogleAuthenticationService
    );
    compiled = fixture.nativeElement;
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

  it('should fail to submit the form by missing the name', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      email: 'example@email.com',
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should fail to submit the form by passing a name too short', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      email: 'example@email.com',
      name: 'test',
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should fail to submit the form by passing a name too long', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      email: 'example@email.com',
      name: 'testttttttttttttttttttttttttttttttttttttttt',
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.invalid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should fail to submit the form by not passing an email', fakeAsync(() => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      name: 'TestingUser',
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
      name: 'TestingUser',
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
      name: 'TestingUser',
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
      name: 'TestingUser',
      password: 'testing',
    });

    const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
    submitBtn.click();
    tick();

    expect(component.form.valid).toBeTrue();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should successfully register with a Google account', fakeAsync(() => {
    spyOn(component, 'onRegisterWithGoogle').and.callThrough();
    spyOn(googleAuthentication, 'initRegister');

    const googleLogoIcon = compiled.querySelector('img') as HTMLImageElement;
    googleLogoIcon.click();
    tick();

    expect(component.onRegisterWithGoogle).toHaveBeenCalled();
    expect(googleAuthentication.initRegister).toHaveBeenCalled();
  }));

  it('should toggle the password input type to text and then back to password', fakeAsync(() => {
    spyOn(component, 'onTogglePassword').and.callThrough();

    // Toggling the input type to text
    let eyeIcon = compiled.querySelector('ng-icon') as HTMLElement;
    eyeIcon.click();
    tick();
    fixture.detectChanges();

    const firstType = (
      compiled.querySelectorAll('input')[2] as HTMLInputElement
    ).type;

    // Toggling the input type back to password
    eyeIcon = compiled.querySelector('ng-icon') as HTMLElement;
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

  it('should navigate to the login page', fakeAsync(
    inject([Location], (location: Location) => {
      const anchorLogin = compiled.querySelector('a') as HTMLAnchorElement;
      anchorLogin.click();
      tick();

      expect(location.path()).toEqual('/auth/login');
    })
  ));
});
