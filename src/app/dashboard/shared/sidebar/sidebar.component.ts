import { Component, Output, EventEmitter } from '@angular/core';
import { DashboardSection } from '../../models/dashboard-sections.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() sectionSelected = new EventEmitter<DashboardSection>();

  onSelectSection(section: string): void {
    switch (section) {
      case DashboardSection.TABLES:
        this.sectionSelected.emit(DashboardSection.TABLES);
        return;

      case DashboardSection.CHARTS:
        this.sectionSelected.emit(DashboardSection.CHARTS);
        return;
    }
    return;
  }
}
