import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NgChartsModule } from 'ng2-charts';
import * as fromApp from '../../../store/app.reducer';

import { RevenuesGraphicsComponent } from './revenues-graphics.component';

describe('RevenuesGraphicsComponent', () => {
  let component: RevenuesGraphicsComponent;
  let fixture: ComponentFixture<RevenuesGraphicsComponent>;
  let compiled: HTMLElement;
  let store: Store;
  const initialState: fromApp.AppState = {
    auth: {
      user: null,
      loading: false,
      error: null,
    },
    userAccount: {
      error: null,
      loading: false,
    },
    dashboard: {
      categories: [],
      revenues: [
        {
          id: 2,
          userId: 4,
          value: 200,
          description: 'New revenue',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          userId: 4,
          value: 300,
          description: 'Food revenue',
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      expenses: [],
      goals: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevenuesGraphicsComponent],
      imports: [FormsModule, NgChartsModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(RevenuesGraphicsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
