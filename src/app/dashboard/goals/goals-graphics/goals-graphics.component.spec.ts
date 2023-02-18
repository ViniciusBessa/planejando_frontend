import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsGraphicsComponent } from './goals-graphics.component';

describe('GoalsGraphicsComponent', () => {
  let component: GoalsGraphicsComponent;
  let fixture: ComponentFixture<GoalsGraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsGraphicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
