import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
export class GoalsGraphicsComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  selectedYear: number = new Date().getFullYear();

  @Output() yearSelected = new EventEmitter<number | null>();

  goalsAchievementsChartData!: ChartData<'bar'>;

  goalsAchievementsChartOptions: ChartConfiguration['options'] = {
    responsive: false,

    plugins: {
      title: {
        display: true,
        text: 'Resultados das metas',
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

  goalsTypePercentageChartData!: ChartData<'pie'>;

  goalsTypePercentageChartOptions: ChartConfiguration['options'] = {
    responsive: false,

    plugins: {
      title: {
        display: true,
        text: 'Metas por tipo',
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

    this.onSelectYear(this.selectedYear);
  }

  ngOnDestroy(): void {
    this.onSelectYear(this.selectedYear);
  }

  onSelectYear(newYear: number | null): void {
    if (newYear) {
      this.selectedYear = newYear;
    }
    this.yearSelected.emit(newYear);
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

    this.goalsAchievementsChartData = {
      labels: this.months,
      datasets: [
        {
          data: this.goalsAchievements[0],
          label: 'Metas alcançadas',
        },
        {
          data: this.goalsAchievements[1],
          label: 'Metas não alcançadas',
        },
      ],
    };
  }

  getGoalTotalExpenses(goal: Goal): number {
    return goal.sumExpenses.reduce((initial, { total }) => initial + total, 0);
  }

  getMonthsMap(): Map<number, boolean> {
    const map = new Map<number, boolean>();

    for (let i = 0; i < 12; i++) {
      map.set(i, false);
    }
    return map;
  }

  expenseIsValid(goalDate: Date, expenseDate: Date): boolean {
    return expenseDate >= goalDate && expenseDate <= new Date();
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

      // Only adding the goals of the current and past years
      if (goalYear <= this.selectedYear) {
        goalsTypes[goal.essentialExpenses ? 0 : 1] += 1;
      }
    }
    return goalsTypes;
  }

  get goalsAchievements(): number[][] {
    const goalsAchievements = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (let goal of this.goals) {
      const goalDate = new Date(
        goal.createdAt.getFullYear(),
        goal.createdAt.getMonth()
      );
      const goalYear = goalDate.getFullYear();
      const goalWasAchieved = this.getGoalTotalExpenses(goal) <= goal.value;

      // If the goal was created after the selected year, just skip it
      if (goalYear > this.selectedYear) {
        continue;
      }
      const monthsMap = this.getMonthsMap();

      for (let sumExpense of goal.sumExpenses) {
        const expenseDate = new Date(this.selectedYear, sumExpense.month - 1);

        if (this.expenseIsValid(goalDate, expenseDate)) {
          goalsAchievements[goalWasAchieved ? 0 : 1][sumExpense.month - 1] += 1;
        }
        monthsMap.set(sumExpense.month - 1, true);
      }

      // Checking if any months didn't contain any expenses relevant to the goal
      for (let [month, hadExpenses] of monthsMap) {
        const expenseDate = new Date(this.selectedYear, month);

        /* 
        Just mark the goal has complete if the expense date is after the goal 
        creation and before the current date
        */
        if (!hadExpenses && this.expenseIsValid(goalDate, expenseDate)) {
          goalsAchievements[0][month] += 1;
        }
      }
    }
    return goalsAchievements;
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
