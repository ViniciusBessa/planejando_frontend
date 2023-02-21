import { Component } from '@angular/core';
import * as fromApp from '../store/app.reducer';
import * as UserAccountActions from '../user-account/store/user-account.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.css'],
})
export class MessageAlertComponent {
  message: string | null = null;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('userAccount').subscribe((state) => {
      if (state.message) {
        this.message = state.message;
        this.onResetMessage();
        this.store.dispatch(UserAccountActions.resetMessage());
      }
    });
  }

  onResetMessage(): void {
    setTimeout(() => (this.message = null), 8000);
  }
}
