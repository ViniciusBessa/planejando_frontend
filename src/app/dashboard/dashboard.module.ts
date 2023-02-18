import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from './goals/goals.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { NgIconsModule } from '@ng-icons/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  bootstrapHandIndex,
  bootstrapSearch,
  bootstrapCaretDownFill,
  bootstrapTrash3Fill,
  bootstrapPencilFill,
  bootstrapCheck2All,
  bootstrapXCircleFill,
  bootstrap123,
  bootstrapDashCircleFill,
  bootstrapPlusCircleFill,
  bootstrapClipboardDataFill,
  bootstrapBarChartFill,
} from '@ng-icons/bootstrap-icons';
import { tablerPigMoney, tablerReportMoney } from '@ng-icons/tabler-icons';
import { matAttachMoney } from '@ng-icons/material-icons/baseline';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { getBrazilianPaginatorIntl } from './shared/brazilian-paginator-intl';
import { DATE_FORMAT } from './shared/date-format';
import { RevenuesTableComponent } from './revenues/revenues-table/revenues-table.component';
import { ExpensesTableComponent } from './expenses/expenses-table/expenses-table.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { ExpensesGraphicsComponent } from './expenses/expenses-graphics/expenses-graphics.component';
import { GoalsGraphicsComponent } from './goals/goals-graphics/goals-graphics.component';
import { NgChartsModule } from 'ng2-charts';
import { RevenuesGraphicsComponent } from './revenues/revenues-graphics/revenues-graphics.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@NgModule({
  declarations: [
    GoalsComponent,
    ExpensesComponent,
    RevenuesComponent,
    OverviewComponent,
    RevenuesTableComponent,
    ExpensesTableComponent,
    GoalListComponent,
    ExpensesGraphicsComponent,
    GoalsGraphicsComponent,
    RevenuesGraphicsComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule,
    NgxGaugeModule,
    NgIconsModule.withIcons({
      bootstrapHandIndex,
      bootstrapSearch,
      bootstrapCaretDownFill,
      tablerPigMoney,
      tablerReportMoney,
      matAttachMoney,
      bootstrapPencilFill,
      bootstrapTrash3Fill,
      bootstrapCheck2All,
      bootstrapXCircleFill,
      bootstrap123,
      bootstrapDashCircleFill,
      bootstrapPlusCircleFill,
      bootstrapClipboardDataFill,
      bootstrapBarChartFill,
    }),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyMaskModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getBrazilianPaginatorIntl() },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
})
export class DashboardModule {}
