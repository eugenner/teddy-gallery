import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { GalleryAllRoutingModule } from "./galleryAll-routing.module";
import { GalleryAllComponent } from "./galleryAll.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        GalleryAllRoutingModule,
        NativeScriptUIListViewModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        GalleryAllComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class GalleryAllModule { }
