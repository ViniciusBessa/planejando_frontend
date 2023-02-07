import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { Error404Component } from './error404/error404.component';
import { HomeComponent } from './home/home.component';
import { LoginRequiredGuard } from './shared/guards/login-required.guard';
import { UserAccountComponent } from './user-account/user-account.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    component: HomeComponent,
    data: { title: 'Início' },
  },
  {
    path: 'contato',
    component: ContactComponent,
    data: { title: 'Contato' },
  },
  {
    path: 'usuario/conta',
    component: UserAccountComponent,
    canActivate: [LoginRequiredGuard],
    data: { title: 'Conta' },
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(
        (module) => module.DashboardModule
      ),
  },
  {
    path: '**',
    component: Error404Component,
    data: { title: 'Página não encontrada' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
