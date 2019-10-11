import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {LocalStorageService} from "../services/local-storage.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(
		private  auth: AuthService,
		private router: Router,
	) {
	}

	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.auth.isAuthenticated()) {
			req = req.clone({
				setHeaders: {
					Authorization: LocalStorageService.getToken(),
				},
			});
		}
		return next.handle(req).pipe(
			catchError(
				(error: HttpErrorResponse) => this.handleAuthError(error)
			)
		);
	}

	private handleAuthError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
		if (error.status === 401) {
			this.router.navigate(['/auth'], {
				queryParams: {
					sessionFailed: true,
				}
			})
		}
		return throwError(error);
	}
}
