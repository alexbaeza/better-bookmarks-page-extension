import { AppState, initialAppState } from './app-state';
import { createContext, useContext } from 'react';

interface AppStateContextProps extends AppState {
  getBookmarks: () => Promise<void>;
  setCurrentPage: (id: string) => void;
}

const stub = (): never => {
  throw new Error(
    'Configuration error, App should be wrapped with <AppStateProvider> to be able to access the state context'
  );
};

export const initialContext: AppStateContextProps = {
  ...initialAppState,
  getBookmarks: stub,
  setCurrentPage: stub
};

const AppStateContext = createContext<AppStateContextProps>(initialContext);

const useAppStateContext = () => useContext(AppStateContext);

export { AppStateContext, useAppStateContext };
