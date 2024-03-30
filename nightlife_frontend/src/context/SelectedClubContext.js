import { createContext, useContext, useState } from 'react';

const SelectedClubContext = createContext();

export const useSelectedClub = () => useContext(SelectedClubContext);

export const SelectedClubProvider = ({ children }) => {
  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <SelectedClubContext.Provider value={{ selectedClub, setSelectedClub }}>
      {children}
    </SelectedClubContext.Provider>
  );
};
