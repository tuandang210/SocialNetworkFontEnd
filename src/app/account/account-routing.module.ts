import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccountListComponent} from './account-list/account-list.component';
import {AccountUpdateComponent} from './account-update/account-update.component';


const routes: Routes = [{
  path: '',
  component: AccountListComponent
}, {
  path: 'update',
  component: AccountUpdateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
