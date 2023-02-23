import { Location } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { ExpensesComponent } from '../dashboard/expenses/expenses.component';
import { GoalsComponent } from '../dashboard/goals/goals.component';
import { RevenuesComponent } from '../dashboard/revenues/revenues.component';
import { HomeComponent } from '../home/home.component';
import {
  bootstrapList,
  bootstrapSunFill,
  bootstrapMoonFill,
  bootstrapCaretDownFill,
  bootstrapLaptopFill,
  bootstrapPersonCircle,
} from '@ng-icons/bootstrap-icons';

import { NavbarComponent } from './navbar.component';
import * as fromApp from '../store/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { NgIconsModule } from '@ng-icons/core';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { OverviewComponent } from '../dashboard/overview/overview.component';
import { ContactComponent } from '../contact/contact.component';
import { UserAccountComponent } from '../user-account/user-account.component';

describe('NavbarComponent', () => {
  describe('User Logged In', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
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
        declarations: [NavbarComponent],
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'inicio',
              component: HomeComponent,
            },
            {
              path: 'contato',
              component: ContactComponent,
            },
            {
              path: 'dashboard',
              component: OverviewComponent,
            },
            {
              path: 'dashboard/metas',
              component: GoalsComponent,
            },
            {
              path: 'dashboard/receitas',
              component: RevenuesComponent,
            },
            {
              path: 'dashboard/despesas',
              component: ExpensesComponent,
            },
            {
              path: 'usuario/conta',
              component: UserAccountComponent,
            },
            {
              path: 'auth/login',
              component: LoginComponent,
            },
            {
              path: 'auth/cadastro',
              component: RegisterComponent,
            },
          ]),
          NgIconsModule.withIcons({
            bootstrapList,
            bootstrapSunFill,
            bootstrapMoonFill,
            bootstrapCaretDownFill,
            bootstrapLaptopFill,
            bootstrapPersonCircle,
          }),
        ],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      component.theme = 'dark';
      fixture.detectChanges();
      compiled = fixture.nativeElement;
      store = fixture.debugElement.injector.get(Store);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate to the home page through the logo', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorHome = compiled.querySelectorAll(
          'a'
        )[0] as HTMLAnchorElement;
        anchorHome.click();
        tick();

        expect(location.path()).toEqual('/inicio');
      })
    ));

    it('should navigate to the home page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorHome = compiled.querySelectorAll(
          'a'
        )[1] as HTMLAnchorElement;
        anchorHome.click();
        tick();

        expect(location.path()).toEqual('/inicio');
      })
    ));

    it('should navigate to the contact page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorContact = compiled.querySelectorAll(
          'a'
        )[2] as HTMLAnchorElement;
        anchorContact.click();
        tick();

        expect(location.path()).toEqual('/contato');
      })
    ));

    it('should navigate to the dashboard page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorDashboard = compiled.querySelectorAll(
          'a'
        )[3] as HTMLAnchorElement;
        anchorDashboard.click();
        tick();

        expect(location.path()).toEqual('/dashboard');
      })
    ));

    it('should navigate to the goals page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorGoals = compiled.querySelectorAll(
          'a'
        )[4] as HTMLAnchorElement;
        anchorGoals.click();
        tick();

        expect(location.path()).toEqual('/dashboard/metas');
      })
    ));

    it('should navigate to the revenues page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorRevenues = compiled.querySelectorAll(
          'a'
        )[5] as HTMLAnchorElement;
        anchorRevenues.click();
        tick();

        expect(location.path()).toEqual('/dashboard/receitas');
      })
    ));

    it('should navigate to the expenses page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorExpenses = compiled.querySelectorAll(
          'a'
        )[6] as HTMLAnchorElement;
        anchorExpenses.click();
        tick();

        expect(location.path()).toEqual('/dashboard/despesas');
      })
    ));

    it('should navigate to the user account page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorExpenses = compiled.querySelectorAll(
          'a'
        )[7] as HTMLAnchorElement;
        anchorExpenses.click();
        tick();

        expect(location.path()).toEqual('/usuario/conta');
      })
    ));

    it('should log out the user', fakeAsync(() => {
      spyOn(component, 'onLogout').and.callThrough();
      spyOn(store, 'dispatch');

      const logOutParagraph = compiled.querySelector(
        'p'
      ) as HTMLParagraphElement;
      logOutParagraph.click();
      tick();

      expect(component.onLogout).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalled();
    }));

    it('should hide the link to the login page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorLogin = compiled.querySelectorAll(
          'a'
        )[8] as HTMLAnchorElement;

        expect(location.path()).not.toEqual('/auth/login');
        expect(anchorLogin).toBeFalsy();
      })
    ));

    it('should hide the link to the register page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorRegister = compiled.querySelectorAll(
          'a'
        )[9] as HTMLAnchorElement;

        expect(location.path()).not.toEqual('/auth/register');
        expect(anchorRegister).toBeFalsy();
      })
    ));

    it('should switch the theme to light', () => {
      spyOn(component, 'onSetTheme').and.callThrough();
      spyOn(component.newTheme, 'emit');

      const sunIcon = compiled.querySelectorAll('ng-icon')[5] as HTMLElement;
      sunIcon.click();

      expect(component.onSetTheme).toHaveBeenCalled();
      expect(component.newTheme.emit).toHaveBeenCalled();
    });
  });

  describe('User Not Logged In', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compiled: HTMLElement;
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
        declarations: [NavbarComponent],
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'inicio',
              component: HomeComponent,
            },
            {
              path: 'contato',
              component: ContactComponent,
            },
            {
              path: 'auth/login',
              component: LoginComponent,
            },
            {
              path: 'auth/cadastro',
              component: RegisterComponent,
            },
          ]),
          NgIconsModule.withIcons({
            bootstrapList,
            bootstrapSunFill,
            bootstrapMoonFill,
            bootstrapCaretDownFill,
            bootstrapLaptopFill,
          }),
        ],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      component.theme = 'light';
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate to the home page through the logo', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorHome = compiled.querySelectorAll(
          'a'
        )[0] as HTMLAnchorElement;
        anchorHome.click();
        tick();

        expect(location.path()).toEqual('/inicio');
      })
    ));

    it('should navigate to the home page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorHome = compiled.querySelectorAll(
          'a'
        )[1] as HTMLAnchorElement;
        anchorHome.click();
        tick();

        expect(location.path()).toEqual('/inicio');
      })
    ));

    it('should navigate to the contact page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorContact = compiled.querySelectorAll(
          'a'
        )[2] as HTMLAnchorElement;
        anchorContact.click();
        tick();

        expect(location.path()).toEqual('/contato');
      })
    ));

    it('should navigate to the login page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorLogin = compiled.querySelectorAll(
          'a'
        )[3] as HTMLAnchorElement;
        anchorLogin.click();
        tick();

        expect(location.path()).toEqual('/auth/login');
      })
    ));

    it('should navigate to the register page', fakeAsync(
      inject([Location], (location: Location) => {
        const anchorRegister = compiled.querySelectorAll(
          'a'
        )[4] as HTMLAnchorElement;
        anchorRegister.click();
        tick();

        expect(location.path()).toEqual('/auth/cadastro');
      })
    ));

    it('should emit a event to switch the theme to dark', () => {
      spyOn(component, 'onSetTheme').and.callThrough();
      spyOn(component.newTheme, 'emit');

      const moonIcon = compiled.querySelectorAll('ng-icon')[4] as HTMLElement;
      moonIcon.click();

      expect(component.onSetTheme).toHaveBeenCalled();
      expect(component.newTheme.emit).toHaveBeenCalled();
    });
  });
});
