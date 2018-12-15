import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, interval, merge, Observable, of } from "rxjs";
import {
    concatMap,
    delay,
    filter,
    flatMap,
    map,
    shareReplay,
    tap,
    timeInterval
} from "rxjs/operators";
import { IImageEntity, IListingImages } from "~/app/EtsyListingImages";
import { IEtsy, IListing } from "~/app/EtsyListingsResult";

export enum ShopSection {
    Pattern = 16208632,
    Toy = 16298628
}

const apiKey = "ur2jtri0lyiife13pyvvhywn";

@Injectable()
export class ProductService {
    forAdoptionViewScrollPosition = 0;
    galleryAllViewScrollPosition = 0;
    private activeListingsUrl = "https://openapi.etsy.com/v2/shops/9065020/listings/active"
        + "?api_key=" + apiKey + "&sort_order=down&limit=100";  // URL to web api
    private allShopSectionListingsUrl = "https://openapi.etsy.com/v2/shops/9065020/sections/:shop_section_id/listings"
        + "?api_key=" + apiKey + "&limit=100";
    private listingImagesUrl = "https://openapi.etsy.com/v2/listings/:listing_id/images"
        + "?api_key=" + apiKey;  // URL to web api

    private selectedItemId: number = -1;
    // private cache = new ObservableArray<any>();
    // private cache = [];
    // private cache2 = [{id: 1, title: "t_1"}, {id: 2, title: "t_2"}];
    private cacheComplete = false;
    private isCollectingDataStarted = false;
    private activeListingsData: Observable<IEtsy>;
    private allShopSectionListingsData: Observable<IEtsy>;
    private activeListingsImagesData: Observable<IListing>;
    private allShopSectionListingsImagesData: Observable<IListing>;
    private selectedItem: any;

    constructor(private http: HttpClient) {
        //
    }

    // request all shop's listings (only one first object)
    getAllShopSectionListings(shopSection: ShopSection): Observable<IEtsy> {
        if (!this.allShopSectionListingsData) {
            console.log("request allShopSectionListingsData");
            this.allShopSectionListingsData = this.http.get<IEtsy>(this.allShopSectionListingsUrl
                .replace(":shop_section_id", "" + shopSection)
            ).pipe(shareReplay(1));
        }

        return this.allShopSectionListingsData;
    }

    getAllShopSectionListingsWithImages(shopSection: ShopSection): Observable<IListing> {
        if (!this.allShopSectionListingsImagesData) {
            this.allShopSectionListingsImagesData = this.getAllShopSectionListings(shopSection).pipe(
                flatMap((etsyData) => etsyData.results)
            ).pipe(
                filter((item) => (item.state === "active")),
                concatMap((i) => of(i).pipe(delay(1000))),
                timeInterval(),

                flatMap((listing) => this.http.get<IListingImages>(this.listingImagesUrl
                .replace(":listing_id", "" + listing.value.listing_id))
                .pipe(
                    tap((listingImages) => console.log(listing.value.title + listing.value.category_id)),

                    map((imageEntity) => {

                        listing.value.imagesData = imageEntity;

                        return listing.value;
                    })
                )),
                shareReplay(1000)
            );
        }

        return this.allShopSectionListingsImagesData;

    }

    // request active shop's listings (only one first object)
    getActiveListings(): Observable<IEtsy> {
        if (!this.activeListingsData) {
            console.log("request");
            this.activeListingsData = this.http.get<IEtsy>(this.activeListingsUrl).pipe(shareReplay(1));
        }

        return this.activeListingsData;
    }

    getActiveListingsWithImages(shopSection: ShopSection): Observable<IListing> {
        if (!this.activeListingsImagesData) {
            this.activeListingsImagesData = this.getActiveListings().pipe(
                flatMap((etsyData) => etsyData.results)
            ).pipe(
                filter((item) => (item.shop_section_id === shopSection)),
                concatMap((i) => of(i).pipe(delay(1000))),
                timeInterval(),

                flatMap((listing) => this.http.get<IListingImages>(this.listingImagesUrl
                .replace(":listing_id", "" + listing.value.listing_id))
                .pipe(
                    tap((listingImages) => console.log(listing.value.title + listing.value.category_id)),

                    map((imageEntity) => {

                        listing.value.imagesData = imageEntity;

                        return listing.value;
                    })
                )),
                shareReplay(1000)
            );
        }

        return this.activeListingsImagesData;

    }

    getCollectingDataStarted(): boolean {
        return this.isCollectingDataStarted;
    }

    setSelectedItemId(id: any) {
        console.log("selected id: " + id);
        this.selectedItemId = id;
    }

    setSelectedItem(item: any) {
        this.selectedItem = item;
    }

    getSelectedItemId() {
        return this.selectedItemId;
    }

    getSelectedItem() {
        return this.selectedItem;
    }
}
