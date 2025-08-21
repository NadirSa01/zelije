import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
export const productApi= createApi({
 reducerPath: 'productApi',
 baseQuery:fetchBaseQuery({ baseUrl: "http://localhost:3000/api"}),
 tagTypes: ['Product'],
endpoints:(builder)=>({
    getProducts:builder.query({
        query:()=>'/products',
        providesTags:['Product']
    }),
    
})
});
export const { useGetProductsQuery } = productApi;