import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
} from '@ng-icons/bootstrap-icons';
import { NgIconsModule } from '@ng-icons/core';
import { provideMockStore } from '@ngrx/store/testing';
import * as fromApp from '../../store/app.reducer';

import { PasswordResetComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
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
      declarations: [PasswordResetComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        ReactiveFormsModule,
        NgIconsModule.withIcons({
          bootstrapEyeFill,
          bootstrapEyeSlashFill,
        }),
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
