import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { billingInterceptorInterceptor } from './billing-interceptor-interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { pendingRequestsInterceptor$ } from 'ng-http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
 provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
     provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),


    provideHttpClient(
      withFetch(),
      withInterceptors([billingInterceptorInterceptor]),
      withInterceptors([pendingRequestsInterceptor$]),
    ),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      progressAnimation: 'increasing'
    })
  ]
};