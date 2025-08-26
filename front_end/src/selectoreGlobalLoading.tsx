// selectors/globalLoading.ts
import { createSelector } from '@reduxjs/toolkit'
import { productApi } from '@/services/products/productApi'
import { clientApi } from '@/services/clients/clientApi'
import { serviceApi } from '@/services/service/serviceApi'

export const selectGlobalLoading = createSelector(
  productApi.util.selectIsFetching,
  clientApi.util.selectIsFetching,
  serviceApi.util.selectIsFetching,
  (productFetching, clientFetching, serviceFetching) =>
    productFetching + clientFetching + serviceFetching > 0
)
