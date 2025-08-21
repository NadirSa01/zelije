import type { IService } from "./service";
import type { IClient } from "./client"; 

export interface IServiceOrder {
  _id: string;
  clientId: string | IClient; 
  serviceId: string | IService; 
  description?: string; 
  state: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
