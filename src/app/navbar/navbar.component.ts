import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  navbarIsHidden: boolean = true;
  @Input() theme!: string;
  @Output() newTheme = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navbarIsHidden = true;
      }
    });
  }

  onToggleNavbar() {
    this.navbarIsHidden = !this.navbarIsHidden;
  }

  onSetTheme(theme: string) {
    this.newTheme.emit(theme);
  }
}
