import * as fromAuth from '../auth/store/auth.reducer';
import * as fromUserAccount from '../user-account/store/user-account.reducer';
import * as fromDashboard from '../dashboard/store/dashboard.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuth.State;
  userAccount: fromUserAccount.State;
  dashboard: fromDashboard.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  userAccount: fromUserAccount.userAccountReducer,
  dashboard: fromDashboard.dashboardReducer,
};
