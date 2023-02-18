import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Goal } from '../../models/goal.model';
import * as fromApp from '../../../store/app.reducer';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-goals-graphics',
  templateUrl: './goals-graphics.component.html',
  styleUrls: ['./goals-graphics.component.css'],
})
export class GoalsGraphicsComponent implements OnInit {
  goals: Goal[] = [];
  selectedYear: number = new Date().getFullYear();

  goalsTypePercentageChartData!: ChartData<'pie'>;

  goalsTypePercentageChartOptions: ChartConfiguration['options'] = {
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
          return `${value} (${((value / this.goals.length) * 100).toFixed(
            1
          )}%)`;
        },
      },
    },
  };

  goalsAchievementPercentageChartData!: ChartData<'pie'>;

  goalsAchievementPercentageChartOptions: ChartConfiguration['options'] = {
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
          return `${value} (${((value / this.goals.length) * 100).toFixed(
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
      this.goals = state.goals;
      this.onUpdateGraphics();
    });
  }

  onUpdateGraphics(): void {
    this.selectedYear = Number(this.selectedYear);

    this.goalsTypePercentageChartData = {
      labels: ['Despesas essenciais', 'Despesas não essenciais'],
      datasets: [
        {
          data: this.goalsTypePercentage,
          label: this.selectedYear.toString(),
        },
      ],
    };

    this.goalsAchievementPercentageChartData = {
      labels: ['Metas alcançadas', 'Metas não alcançadas'],
      datasets: [
        {
          data: this.goalsAchievementPercentage,
          label: this.selectedYear.toString(),
        },
      ],
    };
  }

  get earliestGoalYear(): number {
    let earliestGoalYear = new Date().getFullYear();

    for (let goal of this.goals) {
      const goalYear = goal.createdAt.getFullYear();
      earliestGoalYear = Math.min(goalYear, earliestGoalYear);
    }
    return earliestGoalYear;
  }

  get validYears(): number[] {
    const currentYear = new Date().getFullYear();

    if (this.goals.length === 0) {
      return [currentYear];
    }
    let earliestGoalYear = this.earliestGoalYear;

    const validYears = [];

    while (earliestGoalYear <= currentYear) {
      validYears.push(earliestGoalYear);
      earliestGoalYear += 1;
    }

    return validYears;
  }

  get goalsTypePercentage(): number[] {
    const goalsTypes = [0, 0];

    for (let goal of this.goals) {
      const goalYear = goal.createdAt.getFullYear();

      // Only adding the goals of the current year
      if (goalYear === this.selectedYear) {
        goalsTypes[goal.essentialExpenses ? 0 : 1] += 1;
      }
    }
    return goalsTypes;
  }

  get goalsAchievementPercentage(): number[] {
    const goalsAchivement = [0, 0];

    for (let goal of this.goals) {
      const goalYear = goal.createdAt.getFullYear();

      // Only adding the goals of the current year
      if (goalYear === this.selectedYear) {
        goalsAchivement[goal.sumExpenses <= goal.value ? 0 : 1] += 1;
      }
    }
    return goalsAchivement;
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
