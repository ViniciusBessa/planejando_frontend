import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgIconsModule } from '@ng-icons/core';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
  bootstrapList,
  bootstrapShield,
  bootstrapLaptop,
  bootstrapLaptopFill,
  bootstrapSunFill,
  bootstrapMoonFill,
  bootstrapCaretDownFill,
  bootstrapLockFill,
  bootstrapPhoneFill,
  bootstrapBarChartFill,
  bootstrapInboxesFill,
  bootstrapHandIndexThumbFill,
} from '@ng-icons/bootstrap-icons';

import * as fromApp from './store/app.reducer';
import * as fromAuth from './auth/store/auth.effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Error404Component } from './error404/error404.component';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { FeatureComponent } from './shared/components/feature/feature.component';
import { PlansComponent } from './plans/plans.component';

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ErrorAlertComponent,
    FeatureComponent,
    PlansComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([fromAuth.AuthEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    NgIconsModule.withIcons({
      bootstrapEyeFill,
      bootstrapEyeSlashFill,
      bootstrapList,
      bootstrapShield,
      bootstrapLaptop,
      bootstrapLaptopFill,
      bootstrapSunFill,
      bootstrapMoonFill,
      bootstrapCaretDownFill,
      bootstrapLockFill,
      bootstrapPhoneFill,
      bootstrapBarChartFill,
      bootstrapInboxesFill,
      bootstrapHandIndexThumbFill,
    }),
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
