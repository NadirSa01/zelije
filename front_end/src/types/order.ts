import type { IClient } from "./client";

export interface IOrder {
  _id: string;
  clientId: string | IClient; // Can be ID or populated Client
  state: string;
  installationRequired: boolean;
  installationCost: number;
  createdAt: string;
  updatedAt: string;
}