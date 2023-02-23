import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as fromApp from '../store/app.reducer';
import * as UserAccountActions from '../user-account/store/user-account.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.css'],
})
export class MessageAlertComponent implements OnInit, OnDestroy {
  message: string | null = null;
  messageTimeout: NodeJS.Timeout | null = null;
  animationTimeout: NodeJS.Timeout | null = null;

  @ViewChild('messageParagraph') messageParagraph!: ElementRef;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('userAccount').subscribe((state) => {
      if (state.message) {
        this.onSetMessage(state.message);
        this.store.dispatch(UserAccountActions.resetMessage());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  onSetMessage(message: string): void {
    this.message = message;

    if (this.messageTimeout) {
      this.onResetAnimation();
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.message = null;
      this.messageTimeout = null;
    }, 8000);
  }

  onResetAnimation(): void {
    this.messageParagraph.nativeElement.style.animation = 'none';

    this.animationTimeout = setTimeout(() => {
      this.messageParagraph.nativeElement.style.animation = '';
    }, 100);
  }
}
