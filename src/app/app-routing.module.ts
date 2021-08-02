import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './helper/auth-guard';
import {RegisterComponent} from './register/register.component';



const routes: Routes = [{
  path: 'login',
  component: LoginComponent
}, {
  path: 'accounts',
  canActivate: [AuthGuard],
  loadChildren: () => import('./account/account.module').then(module => module.AccountModule)
},
  {
    path: 'status',
    canActivate: [AuthGuard],
    loadChildren: () => import('./status/status.module').then(module => module.StatusModule)
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile/:username',
    loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
