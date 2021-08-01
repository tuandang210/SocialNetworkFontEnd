import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StatusListComponent} from './status-list/status-list.component';
import {StatusCrateComponent} from './status-crate/status-crate.component';
import {StatusEditComponent} from './status-edit/status-edit.component';


const routes: Routes = [
  {
    path: '',
    component: StatusListComponent
  },

  {
    path: 'edit/:id',
    component: StatusEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule {
}
