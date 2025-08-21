import type { IProductDetail } from "../../types/productDetail";
export interface CreateProductPayload {
  name: Record<string, string>;
  price: number;
  size: string;
  type?: string;
  details: IProductDetail[];
}
