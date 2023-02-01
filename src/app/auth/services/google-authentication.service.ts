import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';

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
  constructor(
    private oauthService: OAuthService,
    private store: Store<fromApp.AppState>
  ) {
    oauthService.configure(oAuthConfig);
  }

  async initLogin() {
    await this.oauthService.loadDiscoveryDocument();
    await this.oauthService.tryLoginImplicitFlow();

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initLoginFlow();
    }
    const userProfile: any = await this.oauthService.loadUserProfile();
    return userProfile;
  }

  async autoLogin() {
    await this.oauthService.loadDiscoveryDocument();
    await this.oauthService.tryLoginImplicitFlow();

    if (!this.oauthService.hasValidAccessToken()) return;

    const userProfile: any = await this.oauthService.loadUserProfile();
    this.store.dispatch(
      AuthActions.loginStart({
        email: userProfile.info.email,
        password: userProfile.info.sub,
        next: null,
      })
    );
  }
}
