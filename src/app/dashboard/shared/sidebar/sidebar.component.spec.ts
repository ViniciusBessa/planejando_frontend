import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NgIconsModule } from '@ng-icons/core';

import { SidebarComponent } from './sidebar.component';
import {
  bootstrapClipboardDataFill,
  bootstrapBarChartFill,
} from '@ng-icons/bootstrap-icons';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [
        NgIconsModule.withIcons({
          bootstrapBarChartFill,
          bootstrapClipboardDataFill,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the tables section', fakeAsync(() => {
    spyOn(component, 'onSelectSection').and.callThrough();
    spyOn(component.sectionSelected, 'emit');

    const tablesButton = compiled.querySelector('button') as HTMLButtonElement;
    tablesButton.click();
    tick();

    expect(component.onSelectSection).toHaveBeenCalled();
    expect(component.sectionSelected.emit).toHaveBeenCalled();
  }));

  it('should select the graphics section', fakeAsync(() => {
    spyOn(component, 'onSelectSection').and.callThrough();
    spyOn(component.sectionSelected, 'emit');

    const graphicsButton = compiled.querySelectorAll(
      'button'
    )[1] as HTMLButtonElement;
    graphicsButton.click();
    tick();

    expect(component.onSelectSection).toHaveBeenCalled();
    expect(component.sectionSelected.emit).toHaveBeenCalled();
  }));
});
