'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { municipiosData } from './mock-data';
import type { MunicipioData } from './types';

interface MunicipioContextType {
  selected: MunicipioData;
  setSelected: (m: MunicipioData) => void;
  all: MunicipioData[];
}

const MunicipioContext = createContext<MunicipioContextType | null>(null);

export function MunicipioProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelectedState] = useState<MunicipioData>(municipiosData[0]);

  useEffect(() => {
    const stored = localStorage.getItem('acelera_municipio');
    if (stored) {
      const found = municipiosData.find(m => m.id === stored);
      if (found) setSelectedState(found);
    }
  }, []);

  function setSelected(m: MunicipioData) {
    setSelectedState(m);
    localStorage.setItem('acelera_municipio', m.id);
  }

  return (
    <MunicipioContext.Provider value={{ selected, setSelected, all: municipiosData }}>
      {children}
    </MunicipioContext.Provider>
  );
}

export function useMunicipio() {
  const ctx = useContext(MunicipioContext);
  if (!ctx) throw new Error('useMunicipio must be used inside MunicipioProvider');
  return ctx;
}
