import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntersectionObserverDirective } from './intersection-observer.directive';

@Component({
  template: `
    <div appIntersectionObserver>
      <p>Some content</p>
    </div>
  `,
})
class TestComponent {}

describe('IntersectionObserverDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [IntersectionObserverDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
