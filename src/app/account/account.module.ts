import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {AccountUpdateComponent} from './account-update/account-update.component';
import {AccountListComponent} from './account-list/account-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AccountBlockComponent } from './account-block/account-block.component';


@NgModule({
  declarations: [
    AccountUpdateComponent,
    AccountListComponent,
    AccountBlockComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AccountModule {
}
