import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private store: Store<fromApp.AppState>,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());

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
  }
}
