import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { provideMockStore } from '@ngrx/store/testing';
import * as fromApp from '../store/app.reducer';

import { UserAccountComponent } from './user-account.component';

describe('UserAccountComponent', () => {
  let component: UserAccountComponent;
  let fixture: ComponentFixture<UserAccountComponent>;
  let initialState: fromApp.AppState = {
    auth: {
      user: null,
      error: null,
      loading: false,
    },
    userAccount: {
      error: null,
      loading: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountComponent],
      imports: [
        NgIconsModule.withIcons({
          bootstrapEyeFill,
          bootstrapEyeSlashFill,
        }),
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
