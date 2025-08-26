import type { IClient } from '@/types/client';
import { createContext } from 'react';
export interface contextClient{
    client : IClient | null;
    isOpen : boolean;
    changeClient: (client : IClient | null) => void;
    changeOpen: (open : boolean) => void;
    
    
}

const defaultContext: contextClient = {
    isOpen :false,
    client: null ,
    changeClient: () => undefined,
    changeOpen: () => undefined,


};

export const ClientUpdateContext = createContext<contextClient>(defaultContext);
