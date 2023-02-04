import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRequiredGuard } from '../shared/guards/login-required.guard';
import { ExpensesComponent } from './expenses/expenses.component';
import { GoalsComponent } from './goals/goals.component';
import { OverviewComponent } from './overview/overview.component';
import { RevenuesComponent } from './revenues/revenues.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginRequiredGuard],
    component: OverviewComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'despesas',
    canActivate: [LoginRequiredGuard],
    component: ExpensesComponent,
    data: { title: 'Despesas' },
  },
  {
    path: 'metas',
    canActivate: [LoginRequiredGuard],
    component: GoalsComponent,
    data: { title: 'Metas' },
  },
  {
    path: 'receitas',
    canActivate: [LoginRequiredGuard],
    component: RevenuesComponent,
    data: { title: 'Receitas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
