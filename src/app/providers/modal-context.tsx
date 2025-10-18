import type React from 'react';
import { createContext, useContext, useState } from 'react';

type ModalContent = React.ReactNode;

interface ModalContextValue {
  showModal: (content: ModalContent) => void;
  hideModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [content, setContent] = useState<ModalContent | null>(null);
  const showModal = (c: ModalContent) => setContent(c);
  const hideModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {content}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be inside ModalProvider');
  return ctx;
};
