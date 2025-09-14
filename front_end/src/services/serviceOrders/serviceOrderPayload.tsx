import type { IClient } from "@/types/client";
import type { IService } from "@/types/service";

export interface OrderSPayload {
  _id:string;
  description:string;
  state:string;
  price:number;
  createdAt:string;
  updatedAt:string;
  client:IClient;
  service:IService
};
export interface OrderServicePayload {
  total: number;
  orders:OrderSPayload[]
}