import type { IProductDetail } from "@/types/productDetail";

export interface Translation {
  en: string;
  fr: string;
  ar: string;
}

export interface Product {
  _id: string;
  name: Translation;
  price: number;
  size: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  details: IProductDetail[];
}
export type ApiRes = {
  total: number
  products: Product[]
}