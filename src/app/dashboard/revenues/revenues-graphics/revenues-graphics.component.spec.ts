import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuesGraphicsComponent } from './revenues-graphics.component';

describe('RevenuesGraphicsComponent', () => {
  let component: RevenuesGraphicsComponent;
  let fixture: ComponentFixture<RevenuesGraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenuesGraphicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenuesGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
