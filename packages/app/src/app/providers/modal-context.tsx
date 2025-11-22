import type { ReactNode } from 'react';
import { createContext, use, useCallback, useMemo, useState } from 'react';

type ModalContent = ReactNode;

interface ModalContextValue {
  showModal: (content: ModalContent) => void;
  hideModal: () => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [content, setContent] = useState<ModalContent | null>(null);

  const showModal = useCallback((content: ModalContent) => setContent(content), []);
  const hideModal = useCallback(() => setContent(null), []);

  const value = useMemo(() => ({ hideModal, showModal }), [hideModal, showModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {content}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  // use() throws if context is undefined, so this is safe
  return use(ModalContext) as ModalContextValue;
};
