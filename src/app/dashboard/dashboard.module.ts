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
  bootstrapThreeDotsVertical,
} from '@ng-icons/bootstrap-icons';
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

@NgModule({
  declarations: [
    GoalsComponent,
    ExpensesComponent,
    RevenuesComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgIconsModule.withIcons({
      bootstrapHandIndex,
      bootstrapSearch,
      bootstrapCaretDownFill,
      bootstrapThreeDotsVertical,
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
