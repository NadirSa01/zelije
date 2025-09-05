import type { IClient } from "@/types/client";
export interface OrderPyl {
    productDetailId:string;
    productId:string;
    quantity:number;
}
export interface orderPayload{
    data:IClient;
    orderPayload:OrderPyl[]
}
export interface orderLine{
    _id:string;
    orderId:string;
    productId:string;
    productDetailId:string;
    quantity:number;
    price:{
        $numberDecimal:string
    };
    createdAt:string;
    updatedAt:string;
    __v:number;
}

export interface orders{
    _id:string;
    clientId:IClient;
    state:string;
    createdAt?:string;
    updatedAt?:string;
    __v?:number;
    orderLines:orderLine[];
    client:IClient
}
export interface payloadOrderGET{
    total:number;
    orders:orders[];
}