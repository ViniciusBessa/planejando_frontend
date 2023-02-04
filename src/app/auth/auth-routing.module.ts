import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutRequiredGuard } from '../shared/guards/logout-required.guard';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'cadastro',
    canActivate: [LogoutRequiredGuard],
    component: RegisterComponent,
    data: { title: 'Cadastro' },
  },
  {
    path: 'login',
    canActivate: [LogoutRequiredGuard],
    component: LoginComponent,
    data: { title: 'Entrar' },
  },
  {
    path: 'recuperar',
    canActivate: [LogoutRequiredGuard],
    component: PasswordResetComponent,
    data: { title: 'Recuperação de senha' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
