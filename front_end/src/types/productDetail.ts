import type { IProduct } from "./product";

export interface IProductDetail {
  _id: string;
  productId: string | IProduct; // Can be just ID or populated Product
  colorName: {
    en: string;
    fr: string;
    ar: string;
  };
  colorCode: string;
  quantity: number;
  picture: string;
  createdAt: string;
  updatedAt: string;
}
