import { Component, NgZone, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import {
    GestureEventData,
    PanGestureEventData,
    PinchGestureEventData,
    SwipeGestureEventData
} from "tns-core-modules/ui/gestures";
import { Image } from "tns-core-modules/ui/image";
import { Label } from "tns-core-modules/ui/label";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { EventData, Page } from "tns-core-modules/ui/page";
import * as utils from "tns-core-modules/utils/utils";
import { IImageEntity } from "~/app/EtsyListingImages";
import { IListing } from "~/app/EtsyListingsResult";
import { ProductService } from "~/app/product.service";

@Component({
    selector: "Featured",
    moduleId: module.id,
    templateUrl: "./featured.component.html",
    styleUrls: ["./featured.component.css"]
})
export class FeaturedComponent implements OnInit {
    items = new ObservableArray<IImageEntity>();
    prevDeltaX = 0;
    prevDeltaY = 0;
    descriptionHeight = 0;
    descriptionHeightInitial = 0;
    prevScale = 1;
    pinchMode = false;
    private selectedItemId: number;
    private selectedItem: IListing;
    private item: IImageEntity;
    private itemNo = 0;
    private itemsCount: number;
    private label;
    private stackLayout: StackLayout;
    private isSwipeModeOn = true;

    constructor(private productService: ProductService, private page: Page, private ngZone: NgZone) {
        // Use the component constructor to inject providers.

    }

    ngOnInit(): void {
        this.selectedItemId = this.productService.getSelectedItemId();
        this.selectedItem = this.productService.getSelectedItem();
        this.items.push(this.selectedItem.imagesData.results);
        this.item = this.selectedItem.imagesData.results[this.itemNo];
        this.itemsCount = this.selectedItem.imagesData.results.length;
        this.label = <Label>(this.page.getViewById("description_label"));
        this.stackLayout = <StackLayout>(this.page.getViewById("stackLayout"));
        this.switchSwipePanMode();
    }

    switchSwipePanMode() {
        const image = <Image>(this.page.getViewById("image"));
        if (this.isSwipeModeOn) {
            image.on("swipe", (e) => {
                this.ngZone.run(() => {
                    const args = <SwipeGestureEventData>e;
                    console.log("Image Swipe Direction : " + args.direction);

                    if (args.direction === 2) {
                        if (this.itemNo + 1 < this.itemsCount) {
                            this.itemNo++;
                        }
                    } else {
                        if (this.itemNo > 0) {
                            this.itemNo--;
                        }
                    }

                    this.item = this.selectedItem.imagesData.results[this.itemNo];
                });
            });
        } else {
            image.off("swipe");
        }

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onPan(args: PanGestureEventData) {
        if (this.isSwipeModeOn) {
            return;
        }

        // args is of type PanGestureEventData
        console.log(`${args.eventName} event triggered for ${args.view}`);

        const image = <Image>args.view;
        if (args.state === 1) {
            this.prevDeltaX = 0;
            this.prevDeltaY = 0;
        } else {
            image.translateX += args.deltaX - this.prevDeltaX;
            image.translateY += args.deltaY - this.prevDeltaY;
            this.prevDeltaX = args.deltaX;
            this.prevDeltaY = args.deltaY;
        }

    }

    onPinch(args: PinchGestureEventData) {
        const image = <Image>args.view;
        console.log(`scale: ${args.scale} state: ${args.state}`);

        const newScale = this.prevScale * args.scale;
        image.scaleX = newScale;
        image.scaleY = newScale;

        this.prevScale = newScale;
        this.isSwipeModeOn = false;
        this.switchSwipePanMode();
    }

    onDoubleTap(args: GestureEventData) {
        console.log("DoubleTap!");
        const image = <Image>args.view;
        this.prevScale = 1;
        image.scaleX = 1;
        image.scaleY = 1;
        image.translateX = 0;
        image.translateY = 0;
        this.isSwipeModeOn = true;
        this.switchSwipePanMode();
    }

    onSwipe(args: SwipeGestureEventData, that: any) {
        console.log("Swipe Direction: " + args.direction);

        if (args.direction === 2) {
            if (that.itemNo + 1 < that.itemsCount) {
                that.itemNo++;
            }
        } else {
            if (that.itemNo > 0) {
                that.itemNo--;
            }
        }

        this.item = this.selectedItem.imagesData.results[this.itemNo];

    }

    onPanLabel(args: PanGestureEventData) {
        console.log("state: " + args.state + " deltaY:" + args.deltaY);
        if (args.state === 2) {
            const newHeight = this.descriptionHeight - args.deltaY;
            if (newHeight < this.descriptionHeightInitial) {
                this.stackLayout.height = this.descriptionHeightInitial;
                this.descriptionHeight = this.descriptionHeightInitial;

                return;
            }

            this.stackLayout.height = this.descriptionHeight - args.deltaY;
        }
        if (args.state === 3) {
            const newHeight = this.descriptionHeight -= args.deltaY;
            if (newHeight < this.descriptionHeightInitial) {
                this.stackLayout.height = this.descriptionHeightInitial;
                this.descriptionHeight = this.descriptionHeightInitial;

                return;
            }
            this.stackLayout.height = newHeight;
        }
    }

    getStackLayoutSize(args: EventData) {
        const obj = <StackLayout>args.object;
        setTimeout(() => {
            this.descriptionHeight = obj.getActualSize().height;
            this.descriptionHeightInitial = this.descriptionHeight;
        }, 200);
    }

    getLabelText(selectedItem: IListing) {
        const text = selectedItem.title + "\n" + selectedItem.description;

        return text;
    }

    launchEtsyShop(): void {
        console.log("launch");
        utils.openUrl(this.selectedItem.url);
    }
}
