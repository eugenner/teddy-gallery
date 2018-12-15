export interface IListingImages {
  count: number;
  results?: Array<IImageEntity> | null;
  params: IParams;
  type: string;
  pagination: {};
}
export interface IImageEntity {
  listing_image_id: number;
  hex_code: string;
  red: number;
  green: number;
  blue: number;
  hue: number;
  saturation: number;
  brightness: number;
  is_black_and_white: boolean;
  creation_tsz: number;
  listing_id: number;
  rank: number;
  url_75x75: string;
  url_170x135: string;
  url_570xN: string;
  url_fullxfull: string;
  full_height: number;
  full_width: number;
}
export interface IParams {
  listing_id: string;
}
