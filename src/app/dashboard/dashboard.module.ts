import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from './goals/goals.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [GoalsComponent, ExpensesComponent, RevenuesComponent, OverviewComponent],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
