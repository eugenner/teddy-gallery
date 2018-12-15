import { IListingImages } from "~/app/EtsyListingImages";

export interface IEtsy {
  count: number;
  results?: Array<IListing> | null;
  params: IParams;
  type: string;
  pagination: IPagination;
}
export interface IListing {
  listing_id: number;
  state: string;
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  creation_tsz: number;
  ending_tsz: number;
  original_creation_tsz: number;
  last_modified_tsz: number;
  price: string;
  currency_code: string;
  quantity: number;
  sku?: Array<null> | null;
  tags?: Array<string> | null;
  category_path?: Array<string> | null;
  category_path_ids?: Array<number> | null;
  materials?: Array<null> | null;
  shop_section_id: number;
  featured_rank?: null;
  state_tsz: number;
  url: string;
  views: number;
  num_favorers: number;
  shipping_template_id?: null;
  processing_min: number;
  processing_max: number;
  who_made: string;
  is_supply: string;
  when_made: string;
  item_weight?: null;
  item_weight_unit: string;
  item_length?: null;
  item_width?: null;
  item_height?: null;
  item_dimensions_unit: string;
  is_private: boolean;
  recipient?: null;
  occasion?: null;
  style?: Array<string> | null;
  non_taxable: boolean;
  is_customizable: boolean;
  is_digital: boolean;
  file_data: string;
  should_auto_renew: boolean;
  language: string;
  has_variations: boolean;
  taxonomy_id: number;
  taxonomy_path?: Array<string> | null;
  used_manufacturer: boolean;
  imagesData: IListingImages | null;
}
export interface IParams {
  limit: string;
  offset: number;
  page?: null;
  shop_id: string;
  keywords?: null;
  sort_on: string;
  sort_order: string;
  min_price?: null;
  max_price?: null;
  color?: null;
  color_accuracy: number;
  tags?: null;
  category?: null;
  translate_keywords: string;
  include_private: number;
}
export interface IPagination {
  effective_limit: number;
  effective_offset: number;
  next_offset: number;
  effective_page: number;
  next_page: number;
}
