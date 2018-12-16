import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { GalleryAllComponent } from "./galleryAll.component";

const routes: Routes = [
    { path: "", component: GalleryAllComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class GalleryAllRoutingModule { }
