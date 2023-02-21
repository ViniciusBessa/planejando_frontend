import { createAction, props } from '@ngrx/store';
import { UserData } from '../../shared/models/user.model';

export const updateNameStart = createAction(
  '[User Account] Update Name Start',
  props<{
    newName: string;
  }>()
);

export const updateEmailStart = createAction(
  '[User Account] Update Email Start',
  props<{
    newEmail: string;
  }>()
);

export const updatePasswordStart = createAction(
  '[User Account] Update Password Start',
  props<{
    newPassword: string;
  }>()
);

export const updateSuccess = createAction(
  '[User Account] Update Success',
  props<{
    user: UserData;
    token: string;
    message: string;
  }>()
);

export const updateFail = createAction(
  '[User Account] Update Fail',
  props<{ error: Error | null }>()
);

export const resetError = createAction('[User Account] Reset Error');

export const resetMessage = createAction('[User Account] Reset Message');

export const deleteAccountStart = createAction(
  '[User Account] Delete Account Start',
  props<{ password: string }>()
);

export const deleteAccountSuccess = createAction(
  '[User Account] Delete Account Success'
);
