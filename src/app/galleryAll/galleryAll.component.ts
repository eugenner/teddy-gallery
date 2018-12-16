import { Component, Injectable, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ListViewItemSnapMode, ListViewScrollEventData, RadListView } from "nativescript-ui-listview";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Subscription } from "rxjs";
import * as app from "tns-core-modules/application";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { IListing } from "~/app/EtsyListingsResult";
import { ProductService, ShopSection } from "~/app/product.service";

@Component({
    selector: "GalleryAll",
    moduleId: module.id,
    templateUrl: "./galleryAll.component.html",
    styleUrls: ["./galleryAll.component.css"]
})
@Injectable()
export class GalleryAllComponent implements OnInit {
    items = new ObservableArray<IListing>();
    sbs: Subscription;
    listView: RadListView;
    private activity: any;
    private isSubscriptionComplete = false;
    private scrollIndex: number;

    constructor(private productService: ProductService, private page: Page,
                private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        console.log("constructor");

    }

    ngOnInit(): void {
        console.log("ngOnInit");

        // app.on(app.resumeEvent, (args: app.ApplicationEventData) => {
        //     this.listView = <RadListView>(this.page.getViewById("listView"));
        //     this.listView.resumeUpdates(true);
        // });

        app.on(app.orientationChangedEvent, (args: app.OrientationChangedEventData) => {
            console.log("orientation changed: " + args.newValue);

        });

        this.page.on("navigatedTo", (data: NavigatedData) => {
            console.log("isBackNavigation2: " + data.isBackNavigation);

            this.listView = <RadListView>(this.page.getViewById("listView"));
            //
            // if (this.listView.updatesSuspended()) {
            //     console.log("galleryAll resume");
            //     this.listView.resumeUpdates(true);
            // }

            if (data.isBackNavigation) {
                this.listView.resumeUpdates(true);
                this.listView.scrollToIndex(this.scrollIndex, false, ListViewItemSnapMode.Start);
                // this.listView.refresh();

                return;
            }

            setTimeout(() => {
                console.log("scrollWithAmount: " + this.productService.galleryAllViewScrollPosition);
                this.listView.scrollWithAmount(this.productService.galleryAllViewScrollPosition, true);
            }, 100);

            this.productService.getAllShopSectionListingsWithImages(ShopSection.Toy).subscribe((item) => {

                this.items.push(item);
                console.log("galleryAll push item: " + item.listing_id);
            }, null, () => {
                this.isSubscriptionComplete = true;
                console.log("complete2");
            });

        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onTap(args: any) {
        // this.sbs.unsubscribe();
        this.listView = <RadListView>(this.page.getViewById("listView"));
        this.scrollIndex = Number(args.view.id);
        this.listView.scrollToIndex(this.scrollIndex, false, ListViewItemSnapMode.Start);
        this.productService.setSelectedItem(this.items.getItem(args.view.id));
        this.productService.setSelectedItemId(args.view.item_listing_id);
        this.routerExtensions.navigate(["/featured"], {animated: false});
    }

    onScrollEnded(args: ListViewScrollEventData) {
        this.productService.galleryAllViewScrollPosition = Number(args.scrollOffset);

    }
}
