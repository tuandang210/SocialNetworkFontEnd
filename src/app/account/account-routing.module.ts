import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountListComponent} from './account-list/account-list.component';
import {AccountUpdateComponent} from './account-update/account-update.component';
import {AccountPasswordComponent} from './account-password/account-password.component';


const routes: Routes = [{
  path: 'list',
  component: AccountListComponent
}, {
  path: 'update/:id',
  component: AccountUpdateComponent
}, {
  path: 'password/:id',
  component: AccountPasswordComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
