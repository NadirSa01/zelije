import { useContext } from 'react';
import { ClientUpdateContext, type contextClient } from './updateUSerContext';

export function useClientUpdate(): contextClient {
  const context = useContext(ClientUpdateContext);
  if (context === undefined) {
    throw new Error('error loading update client context ');
  }
  return context;
}
