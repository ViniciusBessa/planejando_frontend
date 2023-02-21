import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { PasswordResetService } from '../services/password-reset.service';

import { PasswordResetComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  describe('No token provided', () => {
    let component: PasswordResetComponent;
    let fixture: ComponentFixture<PasswordResetComponent>;
    let compiled: HTMLElement;
    let passwordResetService: PasswordResetService;
    const initialState: fromApp.AppState = {
      auth: {
        user: null,
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
        declarations: [PasswordResetComponent],
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientModule,
          ReactiveFormsModule,
          NgIconsModule.withIcons({
            bootstrapEyeFill,
            bootstrapEyeSlashFill,
          }),
        ],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(PasswordResetComponent);
      component = fixture.componentInstance;
      compiled = fixture.nativeElement;
      passwordResetService =
        fixture.debugElement.injector.get(PasswordResetService);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should only show the form to request a token', () => {
      const forms = compiled.querySelectorAll('form');
      expect(forms.length).toEqual(1);
      expect(component.resetToken).toBeFalsy();
      expect(component.tokenIsValid).toBeFalsy();
    });

    it('should fail to submit the form by not providing an email', fakeAsync(() => {
      spyOn(component, 'onGetResetToken');

      const form = component.requestTokenForm;

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('email')!.valid).toBeFalse();
    }));

    it('should fail to submit the form by providing an invalid email', fakeAsync(() => {
      spyOn(component, 'onGetResetToken').and.callThrough();
      spyOn(passwordResetService, 'getResetToken');

      const form = component.requestTokenForm;

      // Filling the form
      form.patchValue({ email: 'email@' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(passwordResetService.getResetToken).not.toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('email')!.valid).toBeFalse();
    }));

    it('should fail to submit the form by providing an invalid email', fakeAsync(() => {
      spyOn(component, 'onGetResetToken').and.callThrough();
      spyOn(passwordResetService, 'getResetToken');

      const form = component.requestTokenForm;

      // Filling the form
      form.patchValue({ email: 'email@' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(passwordResetService.getResetToken).not.toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('email')!.valid).toBeFalse();
    }));

    it('should successfully submit the form', fakeAsync(() => {
      spyOn(component, 'onGetResetToken').and.callThrough();
      spyOn(passwordResetService, 'getResetToken');

      const form = component.requestTokenForm;

      // Filling the form
      form.patchValue({ email: 'email@example.com' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(passwordResetService.getResetToken).toHaveBeenCalled();
      expect(form.valid).toBeTrue();
      expect(form.get('email')!.valid).toBeTrue();
    }));
  });

  describe('Invalid token provided', () => {
    let component: PasswordResetComponent;
    let fixture: ComponentFixture<PasswordResetComponent>;
    let compiled: HTMLElement;
    let passwordResetService: PasswordResetService;
    let initialState: fromApp.AppState = {
      auth: {
        user: null,
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
        declarations: [PasswordResetComponent],
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientModule,
          ReactiveFormsModule,
          NgIconsModule.withIcons({
            bootstrapEyeFill,
            bootstrapEyeSlashFill,
          }),
        ],
        providers: [
          provideMockStore({ initialState }),
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: of({ token: 'invalidToken' }),
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PasswordResetComponent);
      component = fixture.componentInstance;
      compiled = fixture.nativeElement;
      passwordResetService =
        fixture.debugElement.injector.get(PasswordResetService);

      spyOn(passwordResetService, 'verifyResetToken').and.callFake(
        (token: string) => {
          passwordResetService.tokenSubject.next(token);
          passwordResetService.tokenIsValidSubject.next(false);
        }
      );
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should only show the form to request a token because the current token is invalid', () => {
      const forms = compiled.querySelectorAll('form');
      expect(forms.length).toEqual(1);
      expect(component.resetToken).toBeTruthy();
      expect(component.tokenIsValid).toBeFalsy();
    });

    it('should fail to submit the form by not providing an email', fakeAsync(() => {
      spyOn(component, 'onGetResetToken');

      const form = component.requestTokenForm;

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('email')!.valid).toBeFalse();
    }));

    it('should fail to submit the form by providing an invalid email', fakeAsync(() => {
      spyOn(component, 'onGetResetToken').and.callThrough();
      spyOn(passwordResetService, 'getResetToken');

      const form = component.requestTokenForm;

      // Filling the form
      form.patchValue({ email: 'email@' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(passwordResetService.getResetToken).not.toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('email')!.valid).toBeFalse();
    }));

    it('should fail to submit the form by providing an invalid email', fakeAsync(() => {
      spyOn(component, 'onGetResetToken').and.callThrough();
      spyOn(passwordResetService, 'getResetToken');

      const form = component.requestTokenForm;

      // Filling the form
      form.patchValue({ email: 'email@' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(passwordResetService.getResetToken).not.toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('email')!.valid).toBeFalse();
    }));

    it('should successfully submit the form', fakeAsync(() => {
      spyOn(component, 'onGetResetToken').and.callThrough();
      spyOn(passwordResetService, 'getResetToken');

      const form = component.requestTokenForm;

      // Filling the form
      form.patchValue({ email: 'email@example.com' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onGetResetToken).toHaveBeenCalled();
      expect(passwordResetService.getResetToken).toHaveBeenCalled();
      expect(form.valid).toBeTrue();
      expect(form.get('email')!.valid).toBeTrue();
    }));
  });

  describe('Valid token provided', () => {
    let component: PasswordResetComponent;
    let fixture: ComponentFixture<PasswordResetComponent>;
    let compiled: HTMLElement;
    let passwordResetService: PasswordResetService;
    let initialState: fromApp.AppState = {
      auth: {
        user: null,
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
        declarations: [PasswordResetComponent],
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientModule,
          ReactiveFormsModule,
          NgIconsModule.withIcons({
            bootstrapEyeFill,
            bootstrapEyeSlashFill,
          }),
        ],
        providers: [
          provideMockStore({ initialState }),
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: of({ token: 'validToken' }),
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PasswordResetComponent);
      component = fixture.componentInstance;
      compiled = fixture.nativeElement;
      passwordResetService =
        fixture.debugElement.injector.get(PasswordResetService);

      spyOn(passwordResetService, 'verifyResetToken').and.callFake(
        (token: string) => {
          passwordResetService.tokenSubject.next(token);
          passwordResetService.tokenIsValidSubject.next(true);
        }
      );
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should toggle the password', fakeAsync(() => {
      spyOn(component, 'onTogglePassword').and.callThrough();
      expect(component.showPassword).toBeFalse();

      // Clicking the icon to show the password as plain text
      const passwordToggleIcon = compiled.querySelector(
        'ng-icon'
      ) as HTMLElement;
      passwordToggleIcon.click();
      tick();

      expect(component.showPassword).toBeTrue();
      expect(component.onTogglePassword).toHaveBeenCalled();
    }));

    it('should only show the form to reset the password', () => {
      const forms = compiled.querySelectorAll('form');
      expect(forms.length).toEqual(1);
      expect(component.resetToken).toBeTruthy();
      expect(component.tokenIsValid).toBeTrue();
    });

    it('should fail to submit the form by not providing a new password', fakeAsync(() => {
      spyOn(component, 'onResetPassword').and.callThrough();
      spyOn(passwordResetService, 'resetPassword');

      const form = component.passwordResetForm;

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onResetPassword).toHaveBeenCalled();
      expect(passwordResetService.resetPassword).not.toHaveBeenCalled();
      expect(form.valid).toBeFalse();
      expect(form.get('password')!.valid).toBeFalse();
    }));

    it('should successfully submit the form', fakeAsync(() => {
      spyOn(component, 'onResetPassword').and.callThrough();
      spyOn(passwordResetService, 'resetPassword');

      const form = component.passwordResetForm;

      // Filling the form
      form.patchValue({ password: 'password' });

      // Submitting the form
      const submitBtn = compiled.querySelector('button') as HTMLButtonElement;
      submitBtn.click();
      tick();

      expect(component.onResetPassword).toHaveBeenCalled();
      expect(passwordResetService.resetPassword).toHaveBeenCalled();
      expect(form.valid).toBeTrue();
      expect(form.get('password')!.valid).toBeTrue();
    }));
  });
});
