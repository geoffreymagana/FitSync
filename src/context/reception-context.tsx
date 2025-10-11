
"use client";

import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { Location } from '@/lib/types';
import { locations } from '@/lib/data';

interface ReceptionContextType {
  selectedLocation: Location | null;
  setSelectedLocation: (locationId: string) => void;
}

export const ReceptionContext = createContext<ReceptionContextType>({
  selectedLocation: null,
  setSelectedLocation: () => {},
});

export const ReceptionContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocation, setSelectedLocationState] = useState<Location | null>(null);

  useEffect(() => {
    // Set initial location from local storage or default to the first one
    const storedLocationId = localStorage.getItem('receptionLocationId');
    if (storedLocationId) {
      const foundLocation = locations.find(loc => loc.id === storedLocationId);
      setSelectedLocationState(foundLocation || locations[0]);
    } else {
      setSelectedLocationState(locations[0]);
    }
  }, []);

  const handleSetSelectedLocation = (locationId: string) => {
    const foundLocation = locations.find(loc => loc.id === locationId);
    if (foundLocation) {
      setSelectedLocationState(foundLocation);
      localStorage.setItem('receptionLocationId', locationId);
    }
  };

  return (
    <ReceptionContext.Provider value={{ selectedLocation, setSelectedLocation: handleSetSelectedLocation }}>
      {children}
    </ReceptionContext.Provider>
  );
};
