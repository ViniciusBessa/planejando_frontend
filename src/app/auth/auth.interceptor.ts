import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // If there is a token on localStorage, send it on the request headers
    if (token && req.url.match(environment.apiUrl)) {
      const newReq = req.clone({
        headers: new HttpHeaders({
          Authorization: token,
        }),
      });
      return next.handle(newReq);
    }

    // If no token was found, don't change anything in the request
    return next.handle(req);
  }
}
