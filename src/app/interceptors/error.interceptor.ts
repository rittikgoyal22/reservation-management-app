import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse, HttpContextToken
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_URLS } from '../config/app-urls.config';

// When set on a request's HttpContext, a 401/403 on that request will NOT trigger a
// global logout. Use for non-critical cross-service data calls (e.g. loading a
// dropdown from another microservice) so a permission/availability error degrades
// gracefully instead of ending the user's session.
export const SKIP_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false);

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 403) && !req.context.get(SKIP_AUTH_REDIRECT)) {
          localStorage.removeItem('etd_token');
          localStorage.removeItem('etd_refresh_token');
          localStorage.removeItem('etd_role');
          localStorage.removeItem('etd_email');
          window.location.href = `${APP_URLS.auth}/login?logout=true`;
        }
        return throwError(() => error);
      })
    );
  }
}
