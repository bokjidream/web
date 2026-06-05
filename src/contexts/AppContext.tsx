'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AppContextValue {
  large: boolean;
  setLarge: (v: boolean | ((prev: boolean) => boolean)) => void;
  primaryColor: string;
  setPrimaryColor: (c: string) => void;
}

const AppContext = createContext<AppContextValue>({
  large: false,
  setLarge: () => {},
  primaryColor: '#3B7DD8',
  setPrimaryColor: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [large, setLargeState] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState('#3B7DD8');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bokji-large');
      if (stored === '1') setLargeState(true);
      const storedColor = localStorage.getItem('bokji-color');
      if (storedColor) setPrimaryColorState(storedColor);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('bokji-large', large ? '1' : '0'); } catch {}
    document.documentElement.setAttribute('data-large', String(large));
  }, [large]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    document.documentElement.style.setProperty('--primary-light', `rgba(${r},${g},${b},0.12)`);
    document.documentElement.style.setProperty('--primary-soft', `rgba(${r},${g},${b},0.06)`);
    try { localStorage.setItem('bokji-color', primaryColor); } catch {}
  }, [primaryColor]);

  const setLarge = (v: boolean | ((prev: boolean) => boolean)) => {
    setLargeState(v);
  };

  return (
    <AppContext.Provider value={{ large, setLarge, primaryColor, setPrimaryColor: setPrimaryColorState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
