import type { IOrder } from "./order";
import type { IProduct } from "./product";
import type { IProductDetail } from "./productDetail";

export interface IOrderLine {
  _id: string;
  orderId: string | IOrder;             // ID or populated Order
  productId: string | IProduct;         // ID or populated Product
  productDetailId: string | IProductDetail; // ID or populated ProductDetail
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}
