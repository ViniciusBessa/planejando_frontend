import { createReducer, on } from '@ngrx/store';
import * as UserAccountActions from './user-account.actions';

export interface State {
  error: Error | null;
  loading: boolean;
  message: string | null;
}

const initialState: State = {
  error: null,
  loading: false,
  message: null,
};

export const userAccountReducer = createReducer(
  initialState,
  on(
    UserAccountActions.updateNameStart,
    UserAccountActions.updateEmailStart,
    UserAccountActions.updatePasswordStart,
    (state: State) => ({
      ...state,
      loading: true,
    })
  ),

  on(UserAccountActions.updateSuccess, (state: State, { message }) => ({
    ...state,
    loading: false,
    error: null,
    message,
  })),

  on(UserAccountActions.deleteAccountSuccess, (state: State) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(UserAccountActions.updateFail, (state: State, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserAccountActions.resetError, (state: State) => ({
    ...state,
    error: null,
  })),

  on(UserAccountActions.resetMessage, (state: State) => ({
    ...state,
    message: null,
  }))
);
