import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEquipmentList, saveEquipmentList } from '../utils/storage';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const GearContext = createContext(null);

export function GearProvider({ children }) {
  const { user } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function loadGear() {
      setSyncing(true);
      if (user && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('gear')
            .select('*')
            .order('created_at', { ascending: true });

          if (error) throw error;

          const mapped = (data || []).map(i => ({
            id: i.id,
            name: i.name,
            category: i.category,
            weightGrams: i.weight_grams,
            isPacked: i.is_packed,
            notes: i.notes,
            userId: i.user_id
          }));

          // Optionnel: Migrer l'équipement local vers le cloud au tout premier login
          const localGear = getEquipmentList();
          // On ne migre que s'il y a du matériel local ET que la base distante est encore vide
          if (localGear.length > 0 && mapped.length === 0) {
            console.log("Migration de l'équipement local vers Supabase...");
            for (const item of localGear) {
              await supabase.from('gear').insert({
                user_id: user.id,
                name: item.name,
                category: item.category,
                weight_grams: item.weightGrams || 0,
                is_packed: item.isPacked || false,
                notes: item.notes || ''
              });
            }
            
            // Re-charger
            const { data: newData } = await supabase
              .from('gear')
              .select('*')
              .order('created_at', { ascending: true });
              
            const remapped = (newData || []).map(i => ({
              id: i.id, name: i.name, category: i.category,
              weightGrams: i.weight_grams, isPacked: i.is_packed, notes: i.notes
            }));
            setEquipmentList(remapped);
            // Nettoyer localstorage
            saveEquipmentList([]);
          } else {
            setEquipmentList(mapped);
          }
        } catch (e) {
          console.error("Erreur de chargement de l'équipement depuis Supabase:", e);
          setEquipmentList(getEquipmentList());
        }
      } else {
        // Invité : LocalStorage
        setEquipmentList(getEquipmentList());
      }
      setSyncing(false);
    }

    loadGear();
  }, [user]);

  const updateEquipmentList = async (newList) => {
    // Si connecté, on met à jour chaque item modifié individuellement (ou on gère localement en attendant)
    // Pour simplifier l'interaction de masse (ex: cocher un sac entier), on répercute les changements
    if (user && isSupabaseConfigured) {
      try {
        // Supabase supporte les requêtes upsert pour mettre à jour la liste complète d'un coup
        const payload = newList.map(item => ({
          // Si l'ID est un UUID valide (généré par supabase), on le garde, sinon on laisse générer
          id: item.id.length > 15 ? item.id : undefined,
          user_id: user.id,
          name: item.name,
          category: item.category,
          weight_grams: item.weightGrams,
          is_packed: item.isPacked,
          notes: item.notes
        }));
        
        const { data, error } = await supabase
          .from('gear')
          .upsert(payload, { onConflict: 'id' })
          .select();

        if (error) throw error;
        
        const mapped = data.map(i => ({
          id: i.id, name: i.name, category: i.category,
          weightGrams: i.weight_grams, isPacked: i.is_packed, notes: i.notes
        }));
        setEquipmentList(mapped);
      } catch (e) {
        console.error("Erreur lors de la sauvegarde globale de l'équipement sur Supabase :", e);
        // Fallback local en cas d'erreur
        setEquipmentList(newList);
      }
    } else {
      setEquipmentList(newList);
      saveEquipmentList(newList);
    }
  };

  const addEquipmentItem = async (item) => {
    if (user && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('gear')
          .insert({
            user_id: user.id,
            name: item.name,
            category: item.category,
            weight_grams: item.weightGrams || 0,
            is_packed: item.isPacked || false,
            notes: item.notes || ''
          })
          .select();

        if (error) throw error;
        const inserted = data[0];
        setEquipmentList([...equipmentList, {
          id: inserted.id,
          name: inserted.name,
          category: inserted.category,
          weightGrams: inserted.weight_grams,
          isPacked: inserted.is_packed,
          notes: inserted.notes
        }]);
      } catch (e) {
        console.error("Erreur lors de l'ajout d'équipement sur Supabase :", e);
      }
    } else {
      const updated = [...equipmentList, item];
      setEquipmentList(updated);
      saveEquipmentList(updated);
    }
  };

  const deleteEquipmentItem = async (id) => {
    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('gear')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setEquipmentList(equipmentList.filter(i => i.id !== id));
      } catch (e) {
        console.error("Erreur lors de la suppression de matériel sur Supabase :", e);
      }
    } else {
      const updated = equipmentList.filter(i => i.id !== id);
      setEquipmentList(updated);
      saveEquipmentList(updated);
    }
  };

  return (
    <GearContext.Provider value={{
      equipmentList,
      updateEquipmentList,
      addEquipmentItem,
      deleteEquipmentItem,
      syncing,
      reloadEquipment: async () => {
        if (user && isSupabaseConfigured) {
          const { data } = await supabase.from('gear').select('*').order('created_at', { ascending: true });
          const mapped = (data || []).map(i => ({
            id: i.id, name: i.name, category: i.category,
            weightGrams: i.weight_grams, isPacked: i.is_packed, notes: i.notes
          }));
          setEquipmentList(mapped);
        } else {
          setEquipmentList(getEquipmentList());
        }
      }
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
