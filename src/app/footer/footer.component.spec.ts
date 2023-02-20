import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../home/home.component';
import { Location } from '@angular/common';

import { FooterComponent } from './footer.component';
import { RegisterComponent } from '../auth/register/register.component';
import { ContactComponent } from '../contact/contact.component';

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
            path: 'contato',
            component: ContactComponent,
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

  it('should navigate to the home page through the icon', fakeAsync(
    inject([Location], (location: Location) => {
      let anchorHome = compiled.querySelectorAll('a')[0] as HTMLAnchorElement;
      anchorHome.click();
      tick();

      expect(location.path()).toEqual('/inicio');
    })
  ));

  it('should navigate to the home page', fakeAsync(
    inject([Location], (location: Location) => {
      let anchorHome = compiled.querySelectorAll('a')[1] as HTMLAnchorElement;
      anchorHome.click();
      tick();

      expect(location.path()).toEqual('/inicio');
    })
  ));

  it('should navigate to the contact page', fakeAsync(
    inject([Location], (location: Location) => {
      let anchorPlans = compiled.querySelectorAll('a')[2] as HTMLAnchorElement;
      anchorPlans.click();
      tick();

      expect(location.path()).toEqual('/contato');
    })
  ));

  it('should navigate to the register page', fakeAsync(
    inject([Location], (location: Location) => {
      let buttonRegister = compiled.querySelector(
        'button'
      ) as HTMLButtonElement;
      buttonRegister.click();
      tick();

      expect(location.path()).toEqual('/auth/cadastro');
    })
  ));
});
