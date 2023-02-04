import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../home/home.component';
import { Location } from '@angular/common';

import { FooterComponent } from './footer.component';
import { PlansComponent } from '../plans/plans.component';
import { RegisterComponent } from '../auth/register/register.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'inicio',
            component: HomeComponent,
          },
          {
            path: 'planos',
            component: PlansComponent,
          },
          {
            path: 'auth/cadastro',
            component: RegisterComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the home page', fakeAsync(
    inject([Location, Router], (location: Location, router: Router) => {
      router.navigate(['/auth/login']);

      let anchorHome = compiled.querySelectorAll('a')[0] as HTMLAnchorElement;
      anchorHome.click();
      tick();

      expect(location.path()).toEqual('/inicio');
    })
  ));

  it('should navigate to the plans page', fakeAsync(
    inject([Location, Router], (location: Location, router: Router) => {
      router.navigate(['/auth/login']);

      let anchorPlans = compiled.querySelectorAll('a')[1] as HTMLAnchorElement;
      anchorPlans.click();
      tick();

      expect(location.path()).toEqual('/planos');
    })
  ));

  it('should navigate to the register page', fakeAsync(
    inject([Location, Router], (location: Location, router: Router) => {
      router.navigate(['/auth/login']);

      let buttonRegister = compiled.querySelector(
        'button'
      ) as HTMLButtonElement;
      buttonRegister.click();
      tick();

      expect(location.path()).toEqual('/auth/cadastro');
    })
  ));
});
