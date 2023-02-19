import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData } from 'chart.js';
import * as fromApp from '../../../store/app.reducer';
import { Revenue } from '../../models/revenue.model';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-revenues-graphics',
  templateUrl: './revenues-graphics.component.html',
  styleUrls: ['./revenues-graphics.component.css'],
})
export class RevenuesGraphicsComponent implements OnInit {
  revenues: Revenue[] = [];
  selectedYear: number = new Date().getFullYear();

  totalRevenuesChartOptions: ChartConfiguration['options'] = {
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
        text: 'Total das receitas por mês',
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

  totalRevenuesChartData!: ChartData<'bar'>;

  numberOfRevenuesChartOptions: ChartConfiguration['options'] = {
    responsive: false,

    scales: {
      x: {},
      y: {},
    },
    plugins: {
      title: {
        display: true,
        text: 'Número de receitas por mês',
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

  numberOfRevenuesChartData!: ChartData<'bar'>;

  chartPlugins = [DataLabelsPlugin];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('dashboard').subscribe((state) => {
      this.revenues = state.revenues;
      this.onUpdateGraphics();
    });
  }

  onUpdateGraphics(): void {
    this.selectedYear = Number(this.selectedYear);

    this.totalRevenuesChartData = {
      labels: this.months,
      datasets: [
        {
          data: this.totalRevenuesByMonth,
          label: this.selectedYear.toString(),
          backgroundColor: '#0087ff',
        },
      ],
    };

    this.numberOfRevenuesChartData = {
      labels: this.months,
      datasets: [
        {
          data: this.numberOfRevenuesByMonth,
          label: this.selectedYear.toString(),
          backgroundColor: '#0087ff',
        },
      ],
    };
  }

  get earliestRevenueYear(): number {
    let earliestRevenueYear = new Date().getFullYear();

    for (let revenue of this.revenues) {
      const revenueYear = revenue.date.getFullYear();
      earliestRevenueYear = Math.min(revenueYear, earliestRevenueYear);
    }
    return earliestRevenueYear;
  }

  get validYears(): number[] {
    const currentYear = new Date().getFullYear();

    if (this.revenues.length === 0) {
      return [currentYear];
    }
    let earliestRevenueYear = this.earliestRevenueYear;

    const validYears = [];

    while (earliestRevenueYear <= currentYear) {
      validYears.push(earliestRevenueYear);
      earliestRevenueYear += 1;
    }

    return validYears;
  }

  get totalRevenuesByMonth(): number[] {
    const revenuesByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let revenue of this.revenues) {
      const revenueYear = revenue.date.getFullYear();

      // Only adding the revenues of the current year
      if (revenueYear === this.selectedYear) {
        const revenueMonth = revenue.date.getMonth();
        revenuesByMonth[revenueMonth] += revenue.value;
      }
    }
    return revenuesByMonth;
  }

  get numberOfRevenuesByMonth(): number[] {
    const revenuesByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let revenue of this.revenues) {
      const revenueYear = revenue.date.getFullYear();

      // Only adding the revenues of the current year
      if (revenueYear === this.selectedYear) {
        const revenueMonth = revenue.date.getMonth();
        revenuesByMonth[revenueMonth] += 1;
      }
    }
    return revenuesByMonth;
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
