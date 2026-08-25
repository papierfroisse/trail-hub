import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEquipmentList, saveEquipmentList } from '../utils/storage';

const GearContext = createContext(null);

export function GearProvider({ children }) {
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    const loaded = getEquipmentList();
    setEquipmentList(loaded);
  }, []);

  const updateEquipmentList = (newList) => {
    setEquipmentList(newList);
    saveEquipmentList(newList);
  };

  const addEquipmentItem = (item) => {
    const updated = [...equipmentList, item];
    updateEquipmentList(updated);
  };

  const deleteEquipmentItem = (id) => {
    const updated = equipmentList.filter(i => i.id !== id);
    updateEquipmentList(updated);
  };

  return (
    <GearContext.Provider value={{
      equipmentList,
      updateEquipmentList,
      addEquipmentItem,
      deleteEquipmentItem,
      reloadEquipment: () => setEquipmentList(getEquipmentList())
    }}>
      {children}
    </GearContext.Provider>
  );
}

export function useGear() {
  const context = useContext(GearContext);
  if (!context) {
    throw new Error("useGear doit être utilisé au sein de GearProvider");
  }
  return context;
}
