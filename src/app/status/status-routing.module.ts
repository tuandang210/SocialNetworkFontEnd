import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StatusListComponent} from './status-list/status-list.component';
import {StatusEditComponent} from './status-edit/status-edit.component';
import {ImageStatusComponent} from './image-status/image-status.component';


const routes: Routes = [
  {
    path: '',
    component: StatusListComponent
  },

  {
    path: 'edit/:id',
    component: StatusEditComponent
  }, {
    path: 'images',
    component: ImageStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule {
}
