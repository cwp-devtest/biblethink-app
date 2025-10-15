import { createContext, useContext, ReactNode, useState } from 'react';
import { BiblePassage } from '@/services/bibleService';

interface PassageContextType {
  currentPassage: BiblePassage | null;
  setCurrentPassage: (passage: BiblePassage | null) => void;
}

const PassageContext = createContext<PassageContextType | undefined>(undefined);

export function PassageProvider({ children }: { children: ReactNode }) {
  const [currentPassage, setCurrentPassage] = useState<BiblePassage | null>(null);

  return (
    <PassageContext.Provider value={{ currentPassage, setCurrentPassage }}>
      {children}
    </PassageContext.Provider>
  );
}

export function usePassage() {
  const context = useContext(PassageContext);
  if (context === undefined) {
    throw new Error('usePassage must be used within a PassageProvider');
  }
  return context;
}
