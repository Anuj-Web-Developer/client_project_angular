
import { Routes } from '@angular/router';
import { authGuard } from './auth/guard/auth-guard';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },

    {
        path: 'auth',
        loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
    },

    {
        path: '',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./all-module/all-module-module').then(m => m.AllModuleModule)
    },

    {path:'customer', loadChildren: () => import('./all-module/all-module-module').then(m=>m.AllModuleModule)},
   
    {
        path: '**',
        redirectTo: 'auth/login'
    }

];



