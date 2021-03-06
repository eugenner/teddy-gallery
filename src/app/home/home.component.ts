import { Component, Injectable, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import {
    ListViewItemSnapMode,
    ListViewScrollEventData,
    RadListView
} from "nativescript-ui-listview";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Subscription } from "rxjs";
import * as app from "tns-core-modules/application";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { IListing } from "~/app/EtsyListingsResult";
import { ProductService, ShopSection } from "~/app/product.service";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
@Injectable()
export class HomeComponent implements OnInit {
    items = new ObservableArray<IListing>();
    sbs: Subscription;
    listView: RadListView;
    private isSubscriptionComplete = false;
    private scrollIndex = 0;

    constructor(private productService: ProductService, private page: Page,
                private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        console.log("constructor");

    }

    ngOnInit(): void {
        console.log("ngOnInit");
        this.listView = <RadListView>(this.page.getViewById("listView"));
        // this.listView.scrollWithAmount(this.productService.forAdoptionViewScrollPosition, false);

        // app.on(app.resumeEvent, (args: app.ApplicationEventData) => {
        //     this.listView = <RadListView>(this.page.getViewById("listView"));
        //     console.log("home resumeUpdates");
        //     this.listView.resumeUpdates(true);
        // });

        app.on(app.orientationChangedEvent, (args: app.OrientationChangedEventData) => {
            // args.newValue === "portrait" ? this.spanCount = 1 : this.spanCount = 2;
            // Should work to trigger change detection for the ngClass to add padding to the right and left of the nav
            console.log("orientation changed: " + args.newValue);
            // args.newValue === "portrait" ? this.spanCount = 2 : this.spanCount = 1;
            // this.listView.scrollToIndex(1);
            // this.listView.scrollWithAmount(10, false);

            // Have to setup the spanCount parameter with new ListViewGridLayout
            // const lwgl = new ListViewGridLayout();
            // lwgl.spanCount = (args.newValue === "portrait" ? 1 : 2);
            // this.listView.listViewLayout = lwgl;
            // this.setSpanCount((args.newValue === "portrait" ? 1 : 2));

            // this.listView.refresh();

        });

        this.page.on("navigatedTo", (data: NavigatedData) => {
            console.log("isBackNavigation: " + data.isBackNavigation);

            if (data.isBackNavigation) {
                this.listView.resumeUpdates(true);
                this.listView.scrollToIndex(this.scrollIndex, false, ListViewItemSnapMode.Start);

                return;
            }

            setTimeout(() => {
                console.log("scrollWithAmount: " + this.productService.forAdoptionViewScrollPosition);
                this.listView.scrollWithAmount(this.productService.forAdoptionViewScrollPosition, true);
            }, 100);

            this.productService.getActiveListingsWithImages(ShopSection.Toy).subscribe((item) => {
                if (item.title.match("SOLD OUT") != null) {
                    return;
                }
                if (item.title.match("Reserved") != null) {
                    return;
                }

                this.items.push(item);
                console.log("push home item: " + item.listing_id);
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
        this.scrollIndex = Number(args.view.id);
        this.listView.scrollToIndex(this.scrollIndex, false, ListViewItemSnapMode.Start);

        this.productService.setSelectedItem(this.items.getItem(args.view.id));

        this.productService.setSelectedItemId(args.view.item_listing_id);
        this.routerExtensions.navigate(["/featured"], {animated: false});
    }

    onScrollEnded(args: ListViewScrollEventData) {

        console.log("State: Scroll ended with offset: " + args.scrollOffset);
        this.productService.forAdoptionViewScrollPosition = Number(args.scrollOffset);

    }

    getTitle(title: string) {
        const name = title.match("^([A-Za-z ]*).*")[1];

        return name;
    }
}
