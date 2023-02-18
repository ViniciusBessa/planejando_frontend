import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesGraphicsComponent } from './expenses-graphics.component';

describe('ExpensesGraphicsComponent', () => {
  let component: ExpensesGraphicsComponent;
  let fixture: ComponentFixture<ExpensesGraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesGraphicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
