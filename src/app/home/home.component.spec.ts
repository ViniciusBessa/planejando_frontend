import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Location } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from '../auth/register/register.component';
import {
  bootstrapShield,
  bootstrapLaptop,
  bootstrapLockFill,
  bootstrapPhoneFill,
  bootstrapBarChartFill,
  bootstrapInboxesFill,
  bootstrapHandIndexThumbFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { FeatureComponent } from '../shared/components/feature/feature.component';
import { IntersectionObserverDirective } from '../shared/directives/intersection-observer.directive';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        FeatureComponent,
        IntersectionObserverDirective,
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'auth/cadastro',
            component: RegisterComponent,
          },
        ]),
        NgIconsModule.withIcons({
          bootstrapShield,
          bootstrapLaptop,
          bootstrapLockFill,
          bootstrapPhoneFill,
          bootstrapBarChartFill,
          bootstrapInboxesFill,
          bootstrapHandIndexThumbFill,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the register page by clicking the first button', fakeAsync(
    inject([Location], (location: Location) => {
      let button = compiled.querySelectorAll('button')[0];
      button.click();
      tick();

      expect(location.path()).toEqual('/auth/cadastro');
    })
  ));

  it('should navigate to the register page by clicking the second button', fakeAsync(
    inject([Location], (location: Location) => {
      let button = compiled.querySelectorAll('button')[1];
      button.click();
      tick();

      expect(location.path()).toEqual('/auth/cadastro');
    })
  ));
});
