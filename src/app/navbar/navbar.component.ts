import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  navbarIsHidden: boolean = true;
  @Input() theme!: string;
  @Output() newTheme = new EventEmitter<string>();
  userIsLoggedIn: boolean = false;

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navbarIsHidden = true;
      }
    });

    this.store.select('auth').subscribe((state) => {
      this.userIsLoggedIn = !!state.user;
    });
  }

  onToggleNavbar(): void {
    this.navbarIsHidden = !this.navbarIsHidden;
  }

  onSetTheme(theme: string): void {
    this.newTheme.emit(theme);
  }
}
