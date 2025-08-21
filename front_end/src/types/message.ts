import type { IClient } from "./client";

export interface IMessage {
  _id: string;           // MongoDB document ID
  clientId: string | IClient;      // Reference to Client _id
  subject: string;       // Message subject
  message: string;       // Message content
  status: boolean;       // Message status (read/unread)
  createdAt: string;     // Timestamp of creation
  updatedAt: string;     // Timestamp of last update
}