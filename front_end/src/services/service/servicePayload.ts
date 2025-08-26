import type { IService } from "@/types/service";
export interface ServicePayload  {
    message: string;
    services: IService[];
}