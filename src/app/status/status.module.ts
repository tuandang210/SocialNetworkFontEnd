import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusRoutingModule } from './status-routing.module';
import { StatusListComponent } from './status-list/status-list.component';
import { StatusCrateComponent } from './status-crate/status-crate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StatusEditComponent } from './status-edit/status-edit.component';


@NgModule({
    declarations: [StatusListComponent, StatusCrateComponent, StatusEditComponent],
    exports: [
        StatusCrateComponent,
        StatusEditComponent
    ],
    imports: [
        CommonModule,
        StatusRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class StatusModule { }
