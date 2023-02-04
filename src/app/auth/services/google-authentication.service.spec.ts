import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OAuthModule } from 'angular-oauth2-oidc';

import { GoogleAuthenticationService } from './google-authentication.service';
import * as fromApp from '../../store/app.reducer';

describe('GoogleAuthenticationService', () => {
  let service: GoogleAuthenticationService;
  const initialState: fromApp.AppState = {
    auth: {
      user: null,
      error: null,
      loading: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OAuthModule.forRoot(), HttpClientModule],
      providers: [provideMockStore({ initialState })],
    });
    service = TestBed.inject(GoogleAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
