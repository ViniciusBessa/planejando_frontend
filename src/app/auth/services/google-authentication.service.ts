import { Injectable } from '@angular/core';
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
    private store: Store<fromApp.AppState>
  ) {
    oauthService.configure(oAuthConfig);
    store.select('auth').subscribe((state) => {
      this.userIsLoggedIn = !!state.user;
    });
  }

  async loadDocument(): Promise<void> {
    await this.oauthService.loadDiscoveryDocument();
    await this.oauthService.tryLoginImplicitFlow();
  }

  async initLogin(): Promise<GoogleUserData> {
    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initLoginFlow();
    }
    const userProfile =
      (await this.oauthService.loadUserProfile()) as GoogleUserData;
    return userProfile;
  }

  async autoLogin(): Promise<void> {
    if (!this.oauthService.hasValidAccessToken() || this.userIsLoggedIn) return;

    const userProfile: any = await this.oauthService.loadUserProfile();
    const email = userProfile.info.email;
    const password = userProfile.info.sub;

    if (email && password) {
      this.store.dispatch(
        AuthActions.loginStart({
          email,
          password,
          next: null,
        })
      );
    }
  }
}
