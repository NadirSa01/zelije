import { useSelector } from "react-redux";
import { productApi } from "@/services/products/productApi"; // your RTK Query slice
export const useProductFromCache = (id :string) => {
    const productsCash = useSelector(productApi.endpoints.getProducts.select());
    const product = productsCash?.data?.products.find((p)=>p._id== id)
   return product;
};