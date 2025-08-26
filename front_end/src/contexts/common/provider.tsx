import {   useState, type ReactNode } from 'react';
import { ClientUpdateContext } from './updateUSerContext';
import type { IClient } from '@/types/client';
interface clientUpdateProviderProps {
  children: ReactNode;
}

export default function ClientUpdateProvider({ children }: clientUpdateProviderProps) {

const [isOpen,setIsOpen] = useState(false);
const [client,setClient] =useState<IClient |null>(null) ;
const changeClient = (clientVar:IClient|null)=>{
    setClient(clientVar);
}
const changeOpen =(isOpenVar:boolean )=>{
    setIsOpen(isOpenVar)
}
  return (
    <ClientUpdateContext.Provider value={{isOpen,client, changeClient,changeOpen}}>
      {children}
    </ClientUpdateContext.Provider>
  );
};
