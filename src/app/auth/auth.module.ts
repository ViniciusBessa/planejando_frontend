import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import {
  bootstrapEyeFill,
  bootstrapEyeSlashFill,
} from '@ng-icons/bootstrap-icons';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, PasswordResetComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({
      bootstrapEyeFill,
      bootstrapEyeSlashFill,
    }),
  ],
})
export class AuthModule {}
