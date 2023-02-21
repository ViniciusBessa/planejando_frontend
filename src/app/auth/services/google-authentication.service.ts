import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { GoogleUserData } from './google-user-data.model';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: environment.clientId,
  scope: 'openid profile email',
  silentRefreshRedirectUri: window.location.origin,
  logoutUrl: window.location.origin,
};

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthenticationService {
  userIsLoggedIn: boolean = false;

  constructor(
    private oauthService: OAuthService,
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {
    oauthService.configure(oAuthConfig);
    store.select('auth').subscribe((state) => {
      this.userIsLoggedIn = !!state.user;
    });
  }

  async loadDocument(): Promise<void> {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (this.oauthService.hasValidIdToken()) {
      if (this.oauthService.state === 'login') {
        await this.router.navigate(['/auth', 'login']);
        await this.initLogin();
      } else if (this.oauthService.state === 'register') {
        await this.router.navigate(['/auth', 'cadastro']);
        await this.initRegister();
      }
    }
  }

  async initLogin(): Promise<void> {
    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initLoginFlow('login');
    }

    const userProfile =
      (await this.oauthService.loadUserProfile()) as GoogleUserData;

    this.store.dispatch(
      AuthActions.loginStart({
        email: userProfile.info.email,
        password: userProfile.info.sub,
        next: null,
      })
    );
  }

  async initRegister(): Promise<void> {
    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initLoginFlow('register');
    }

    const userProfile =
      (await this.oauthService.loadUserProfile()) as GoogleUserData;

    this.store.dispatch(
      AuthActions.registerStart({
        name: userProfile.info.name,
        email: userProfile.info.email,
        password: userProfile.info.sub,
        profile_image: userProfile.picture,
        next: null,
      })
    );
  }
}
