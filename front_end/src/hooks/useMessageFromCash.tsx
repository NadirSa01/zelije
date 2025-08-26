import { messageApi } from "@/services/messages/messageApi"
import { useSelector } from "react-redux"

export const useMessageFromCache=(id:string)=>{
    const messageCache = useSelector(messageApi.endpoints.getMessages.select());
    const message = messageCache?.data?.messages.find((m)=>m._id==id);
    return message
}