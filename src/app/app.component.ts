import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { Title } from '@angular/platform-browser';
import { GoogleAuthenticationService } from './auth/services/google-authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  theme!: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private googleAuthentication: GoogleAuthenticationService,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Trying to auto login with the backend and Google account
    this.store.dispatch(AuthActions.autoLogin());
    await this.googleAuthentication.loadDocument();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Buscando o título da página no primeiro nível da rota
        let pageTitle = this.route.snapshot.firstChild?.data['title'];

        // Se o título não foi encontrado, busque no segundo nível da rota
        if (!pageTitle) {
          pageTitle = this.route.snapshot.firstChild?.firstChild?.data['title'];
        }
        this.title.setTitle(pageTitle);
      }
    });

    // Setting the theme
    const storedTheme = localStorage.getItem('theme');
    this.onSetTheme(storedTheme);
  }

  async onSetTheme(newTheme: string | null): Promise<void> {
    this.theme = newTheme || 'system';
    localStorage.setItem('theme', this.theme);
  }

  systemThemeIsDark(): boolean {
    const isSystemThemeDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return isSystemThemeDark;
  }
}
