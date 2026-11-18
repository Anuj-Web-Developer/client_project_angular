import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const billingInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const toast = inject(ToastrService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  const isAdminApi = req.url.includes('/api/');
const isCustomerApi = req.url.includes('/auth/customer');

const clonedReq = req.clone({
  setHeaders: (isAdminApi && token) ? { Authorization: `Bearer ${token}` } : {},
  withCredentials: isCustomerApi
});

  return next(clonedReq).pipe(
    catchError((error) => {

      if (error.status === 401) {
        localStorage.removeItem('token');
        // toast.error('Session expired. Please login again.');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};



