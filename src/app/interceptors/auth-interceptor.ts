// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('token');

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };



// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const platformId = inject(PLATFORM_ID);

//   let token: string | null = null;

//   if (isPlatformBrowser(platformId)) {
//     token = localStorage.getItem('token');
//   }

//   if (token) {
//     console.log("Interceptor adding token:", token);
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };


// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   console.log("Auth interceptor called");   
//   const platformId = inject(PLATFORM_ID);
//   let token: string | null = null;

//   if (isPlatformBrowser(platformId)) {
//     const userObj = sessionStorage.getItem('userobj');
//     if (userObj) {
//       try {
//         // token = JSON.parse(userObj).token;  //token
//         token = userObj?.token?.result ?? null;

//       } catch (error) {
//         console.error("Error parsing userobj from sessionStorage:", error);
//       }
//     }
//     console.log("Interceptor adding token:", token);
//   }

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };


// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   console.log("Auth interceptor called");

//   const platformId = inject(PLATFORM_ID);
//   let token: string | null = null;

//   if (isPlatformBrowser(platformId)) {
//     const userObjStr = sessionStorage.getItem('userobj');

//     if (userObjStr) {
//       try {
//         const userObj = JSON.parse(userObjStr);

//         token = userObj?.token?.result ?? null;

//       } catch (err) {
//         console.error("Error parsing userobj:", err);
//       }
//     }
//   }

//   console.log("Interceptor adding token:", token);

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };


import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Auth interceptor called');

  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    const userObjStr = sessionStorage.getItem('userobj');

    if (userObjStr) {
      try {
        const userObj = JSON.parse(userObjStr);
        // token = userObj?.token?.result ?? null;
        token = userObj?.token ?? null;
      } catch (err) {
        console.error('Error parsing userobj:', err);
      }
    }
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.warn('401 Unauthorized - redirecting to login');

        // Clear session
        if (isPlatformBrowser(platformId)) {
          sessionStorage.clear();
        }

        // Redirect to login
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};