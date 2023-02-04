import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgIconsModule } from '@ng-icons/core';
import { bootstrap0Square } from '@ng-icons/bootstrap-icons';

import { FeatureComponent } from './feature.component';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureComponent],
      imports: [NgIconsModule.withIcons({ bootstrap0Square })],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    component.iconName = 'bootstrap0Square';
    component.title = 'Title';
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the icon', () => {
    const icon = compiled.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should render the title', () => {
    const headingText = compiled.querySelector('h1');
    expect(headingText).toBeTruthy();
    expect(headingText?.innerText).toEqual(component.title);
  });
});
