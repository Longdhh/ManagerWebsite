import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
export const appRoutes: Routes = [
    //localhost:4200
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    //localhost:4200/login
    { path: 'login', loadChildren: () => import('../app/user/login/login.module').then(x => x.LoginModule) },
    { path: 'main',  loadChildren: () => import('./management/main.module').then(x => x.MainModule), canActivate:[AuthGuard] },
    { path: 'forgot-password',  loadChildren: () => import('./user/forgot-password/forgot-password.module').then(x => x.ForgotPasswordModule) }
]