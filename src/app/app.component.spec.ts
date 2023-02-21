import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  bootstrapList,
  bootstrapSunFill,
  bootstrapMoonFill,
  bootstrapCaretDownFill,
  bootstrapLaptopFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { MessageAlertComponent } from './message-alert/message-alert.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        OAuthModule.forRoot(),
        HttpClientModule,
        NgIconsModule.withIcons({
          bootstrapList,
          bootstrapSunFill,
          bootstrapMoonFill,
          bootstrapCaretDownFill,
          bootstrapLaptopFill,
        }),
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        ErrorAlertComponent,
        MessageAlertComponent,
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
