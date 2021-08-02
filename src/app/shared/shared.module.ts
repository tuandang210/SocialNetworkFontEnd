import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [NavBarComponent],
    exports: [
        NavBarComponent
    ],
    imports: [
        CommonModule,
        SharedRoutingModule,
        FormsModule
    ]
})
export class SharedModule { }
