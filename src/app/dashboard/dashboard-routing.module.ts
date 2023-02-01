import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './expenses/expenses.component';
import { GoalsComponent } from './goals/goals.component';
import { OverviewComponent } from './overview/overview.component';
import { RevenuesComponent } from './revenues/revenues.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'despesas',
    component: ExpensesComponent,
    data: { title: 'Despesas' },
  },
  {
    path: 'metas',
    component: GoalsComponent,
    data: { title: 'Metas' },
  },
  {
    path: 'receitas',
    component: RevenuesComponent,
    data: { title: 'Receitas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
