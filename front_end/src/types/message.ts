import type { IClient } from "./client";

export interface IMessage {
  _id: string;           // MongoDB document ID
  subject: string;       // Message subject
  message: string;       // Message content
  status: boolean;       // Message status (read/unread)
  createdAt: string;     // Timestamp of creation
  updatedAt: string; 
  client: IClient;
}