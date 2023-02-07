import { createAction, props } from '@ngrx/store';
import { UserData } from '../../shared/models/user.model';

export const registerStart = createAction(
  '[Auth] Register Start',
  props<{
    name: string;
    email: string;
    password: string;
    profile_image: string;
    next: string | null;
  }>()
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string; next: string | null }>()
);

export const authSuccess = createAction(
  '[Auth] Auth Success',
  props<{
    user: UserData;
    token: string;
    next: string | null;
    redirect: boolean;
  }>()
);

export const authFail = createAction(
  '[Auth] Auth Fail',
  props<{ error: Error | null }>()
);

export const autoLogin = createAction('[Auth] Auto Login');

export const logoutUser = createAction('[Auth] Logout User');

export const resetError = createAction('[Auth] Reset Error');
