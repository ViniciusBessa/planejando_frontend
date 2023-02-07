import { createReducer, on } from '@ngrx/store';
import * as UserAccountActions from './user-account.actions';

export interface State {
  error: Error | null;
  loading: boolean;
}

const initialState: State = {
  error: null,
  loading: false,
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

  on(
    UserAccountActions.updateSuccess,
    UserAccountActions.deleteAccountSuccess,
    (state: State) => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(UserAccountActions.updateFail, (state: State, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserAccountActions.resetError, (state: State) => ({
    ...state,
    error: null,
  }))
);
