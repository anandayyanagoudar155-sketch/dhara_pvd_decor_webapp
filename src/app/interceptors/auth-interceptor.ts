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


import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Auth interceptor called");   
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    const userObj = sessionStorage.getItem('userobj');
    if (userObj) {
      try {
        token = JSON.parse(userObj).token;  //token
      } catch (error) {
        console.error("Error parsing userobj from sessionStorage:", error);
      }
    }
    console.log("Interceptor adding token:", token);
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

