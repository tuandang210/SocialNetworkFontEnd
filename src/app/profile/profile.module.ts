import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {FormsModule} from '@angular/forms';
import {StatusModule} from '../status/status.module';


@NgModule({
    declarations: [
        ProfileComponent
    ],
    exports: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        StatusModule
    ]
})
export class ProfileModule { }
