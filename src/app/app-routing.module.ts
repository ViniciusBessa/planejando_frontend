import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { Error404Component } from './error404/error404.component';
import { HomeComponent } from './home/home.component';
import { PlansComponent } from './plans/plans.component';

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
    path: 'planos',
    component: PlansComponent,
    data: { title: 'Planos' },
  },
  {
    path: 'contato',
    component: ContactComponent,
    data: { title: 'Contato' },
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
