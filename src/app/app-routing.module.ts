import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './helper/auth-guard';


const routes: Routes = [{
  path: 'login',
  component: LoginComponent
}, {
  path: 'accounts',
  canActivate: [AuthGuard],
  loadChildren: () => import('./account/account.module').then(module => module.AccountModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
