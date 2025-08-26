import type { IClient } from "@/types/client";

export interface clientPayload {
  message: string;
  clients: IClient[];
}
