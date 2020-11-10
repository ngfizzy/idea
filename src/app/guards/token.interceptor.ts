import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Interseptor sets token for each request
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authToken = localStorage.getItem('authToken') || '';

      request = request.clone({
        setHeaders: {
          Authorization: authToken,
        }
      });

      return next.handle(request);
    }
  }
