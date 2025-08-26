import { serviceApi } from "@/services/service/serviceApi"
import { useSelector } from "react-redux"

export const useServiceFromCash = (id:string)=>{
    const  serviceCash = useSelector(serviceApi.endpoints.getServices.select());
    const service = serviceCash?.data?.services.find((p)=>p._id==id)
    return service
}