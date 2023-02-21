import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as fromApp from '../../store/app.reducer';

import { PasswordResetService } from './password-reset.service';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [provideMockStore({ initialState })],
    });
    service = TestBed.inject(PasswordResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
