import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData } from 'chart.js';
import * as fromApp from '../../../store/app.reducer';
import { Expense } from '../../models/expense.model';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-expenses-graphics',
  templateUrl: './expenses-graphics.component.html',
  styleUrls: ['./expenses-graphics.component.css'],
})
export class ExpensesGraphicsComponent implements OnInit {
  expenses: Expense[] = [];
  selectedYear: number = new Date().getFullYear();

  totalExpensesChartOptions: ChartConfiguration['options'] = {
    responsive: false,

    scales: {
      x: {},
      y: {
        ticks: {
          callback: (value, index, values) => {
            return formatCurrency(value as number, 'pt-BR', 'R$');
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Total de despesas por mês',
        align: 'center',
      },
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter(value, context) {
          return formatCurrency(value as number, 'pt-BR', 'R$');
        },
      },
    },
  };

  totalExpensesChartData!: ChartData<'bar'>;

  numberOfExpensesChartOptions: ChartConfiguration['options'] = {
    responsive: false,

    scales: {
      x: {},
      y: {},
    },
    plugins: {
      title: {
        display: true,
        text: 'Número de despesas por mês',
        align: 'center',
      },
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  numberOfExpensesChartData!: ChartData<'bar'>;

  expensesTypePercentageChartData!: ChartData<'pie'>;

  expensesTypePercentageChartOptions: ChartConfiguration['options'] = {
    responsive: false,

    plugins: {
      title: {
        display: true,
        text: 'Despesas por tipo',
        align: 'center',
      },
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value, ctx) => {
          return `${value} (${((value / this.expenses.length) * 100).toFixed(
            1
          )}%)`;
        },
      },
    },
  };

  chartPlugins = [DataLabelsPlugin];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.expenses = state.expenses;
      this.onUpdateGraphics();
    });
  }

  onUpdateGraphics(): void {
    this.selectedYear = Number(this.selectedYear);

    this.totalExpensesChartData = {
      labels: this.months,
      datasets: [
        {
          data: this.totalExpensesByMonth,
          label: this.selectedYear.toString(),
          backgroundColor: '#0087ff',
        },
      ],
    };

    this.numberOfExpensesChartData = {
      labels: this.months,
      datasets: [
        {
          data: this.numberOfExpensesByMonth,
          label: this.selectedYear.toString(),
          backgroundColor: '#0087ff',
        },
      ],
    };

    this.expensesTypePercentageChartData = {
      labels: ['Essencial', 'Não Essencial'],
      datasets: [
        {
          data: this.expensesTypePercentage,
          label: this.selectedYear.toString(),
        },
      ],
    };
  }

  get earliestExpenseYear(): number {
    let earliestExpenseYear = new Date().getFullYear();

    for (let expense of this.expenses) {
      const expenseYear = expense.date.getFullYear();
      earliestExpenseYear = Math.min(expenseYear, earliestExpenseYear);
    }
    return earliestExpenseYear;
  }

  get validYears(): number[] {
    const currentYear = new Date().getFullYear();

    if (this.expenses.length === 0) {
      return [currentYear];
    }
    let earliestExpenseYear = this.earliestExpenseYear;

    const validYears = [];

    while (earliestExpenseYear <= currentYear) {
      validYears.push(earliestExpenseYear);
      earliestExpenseYear += 1;
    }

    return validYears;
  }

  get totalExpensesByMonth(): number[] {
    const expensesByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let expense of this.expenses) {
      const expenseYear = expense.date.getFullYear();

      // Only adding the expenses of the current year
      if (expenseYear === this.selectedYear) {
        const expenseMonth = expense.date.getMonth();
        expensesByMonth[expenseMonth] += expense.value;
      }
    }
    return expensesByMonth;
  }

  get numberOfExpensesByMonth(): number[] {
    const expensesByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let expense of this.expenses) {
      const expenseYear = expense.date.getFullYear();

      // Only adding the expenses of the current year
      if (expenseYear === this.selectedYear) {
        const expenseMonth = expense.date.getMonth();
        expensesByMonth[expenseMonth] += 1;
      }
    }
    return expensesByMonth;
  }

  get expensesTypePercentage(): number[] {
    const expensesTypes = [0, 0];

    for (let expense of this.expenses) {
      const expenseYear = expense.date.getFullYear();

      // Only adding the expenses of the current year
      if (expenseYear === this.selectedYear) {
        expensesTypes[expense.isEssential ? 0 : 1] += 1;
      }
    }
    return expensesTypes;
  }

  get months(): string[] {
    return [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
  }
}
