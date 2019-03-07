import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

/**
 * Interseptor sets token for each request
 */
export class TokenInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authToken = localStorage.getItem('authToken');
      request = request.clone({
        setHeaders: {
          Authorization: authToken,
        }
      });

      return next.handle(request);
    }
  }
