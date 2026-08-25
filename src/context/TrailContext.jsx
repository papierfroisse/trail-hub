import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedTrails, saveTrails } from '../utils/storage';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const TrailContext = createContext(null);

export function TrailProvider({ children }) {
  const { user } = useAuth();
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [activeHoverPoint, setActiveHoverPoint] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Charger les trails au démarrage ou lors du changement de session
  useEffect(() => {
    async function loadTrails() {
      setSyncing(true);
      if (user && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('trails')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Convertir les noms des colonnes de snake_case (Postgres) à camelCase (React/App)
          const mapped = (data || []).map(t => ({
            id: t.id,
            name: t.name,
            date: t.date,
            distanceKm: t.distance_km,
            dPlus: t.d_plus,
            dMinus: t.d_minus,
            status: t.status,
            notes: t.notes,
            waypoints: t.waypoints,
            elevationProfile: t.elevation_profile,
            createdAt: t.created_at,
            userId: t.user_id
          }));

          // Optionnel: Migrer les trails locaux vers le cloud au tout premier login
          const localTrails = getSavedTrails();
          if (localTrails.length > 0 && mapped.length === 0) {
            console.log("Migration des trails locaux vers Supabase...");
            for (const local of localTrails) {
              await supabase.from('trails').insert({
                user_id: user.id,
                name: local.name,
                date: local.date,
                distance_km: local.distanceKm || 0,
                d_plus: local.dPlus || 0,
                d_minus: local.dMinus || 0,
                status: local.status || 'À venir',
                notes: local.notes || '',
                waypoints: local.waypoints || [],
                elevation_profile: local.elevationProfile || []
              });
            }
            // Re-charger après migration
            const { data: newData } = await supabase
              .from('trails')
              .select('*')
              .order('created_at', { ascending: false });
            
            const remapped = (newData || []).map(t => ({
              id: t.id, name: t.name, date: t.date, distanceKm: t.distance_km,
              dPlus: t.d_plus, dMinus: t.d_minus, status: t.status, notes: t.notes,
              waypoints: t.waypoints, elevationProfile: t.elevation_profile, createdAt: t.created_at
            }));
            setTrails(remapped);
            // Vider le localstorage pour éviter les doublons au prochain login/logout
            saveTrails([]);
          } else {
            setTrails(mapped);
          }
        } catch (e) {
          console.error("Erreur de chargement des trails depuis Supabase:", e);
          setTrails(getSavedTrails());
        }
      } else {
        // Mode Invité / Non connecté : LocalStorage
        setTrails(getSavedTrails());
      }
      setSyncing(false);
    }

    loadTrails();
  }, [user]);

  const addTrail = async (newTrail) => {
    if (user && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('trails')
          .insert({
            user_id: user.id,
            name: newTrail.name,
            date: newTrail.date,
            distance_km: newTrail.distanceKm || 0,
            d_plus: newTrail.dPlus || 0,
            d_minus: newTrail.dMinus || 0,
            status: newTrail.status || 'À venir',
            notes: newTrail.notes || '',
            waypoints: newTrail.waypoints || [],
            elevation_profile: newTrail.elevationProfile || []
          })
          .select();

        if (error) throw error;
        
        const inserted = data[0];
        const mappedTrail = {
          id: inserted.id,
          name: inserted.name,
          date: inserted.date,
          distanceKm: inserted.distance_km,
          dPlus: inserted.d_plus,
          dMinus: inserted.d_minus,
          status: inserted.status,
          notes: inserted.notes,
          waypoints: inserted.waypoints,
          elevationProfile: inserted.elevation_profile,
          createdAt: inserted.created_at
        };

        setTrails([mappedTrail, ...trails]);
      } catch (e) {
        console.error("Erreur lors de l'ajout du trail sur Supabase :", e);
      }
    } else {
      // Mode local
      const updated = [newTrail, ...trails];
      setTrails(updated);
      saveTrails(updated);
    }
  };

  const deleteTrail = async (id) => {
    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('trails')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setTrails(trails.filter(t => t.id !== id));
      } catch (e) {
        console.error("Erreur lors de la suppression du trail sur Supabase :", e);
      }
    } else {
      // Mode local
      const updated = trails.filter(t => t.id !== id);
      setTrails(updated);
      saveTrails(updated);
    }

    if (selectedTrail?.id === id) {
      setSelectedTrail(null);
    }
  };

  return (
    <TrailContext.Provider value={{
      trails,
      addTrail,
      deleteTrail,
      selectedTrail,
      setSelectedTrail,
      activeHoverPoint,
      setActiveHoverPoint,
      syncing,
      reloadTrails: async () => {
        if (user && isSupabaseConfigured) {
          const { data } = await supabase.from('trails').select('*').order('created_at', { ascending: false });
          const mapped = (data || []).map(t => ({
            id: t.id, name: t.name, date: t.date, distanceKm: t.distance_km,
            dPlus: t.d_plus, dMinus: t.d_minus, status: t.status, notes: t.notes,
            waypoints: t.waypoints, elevationProfile: t.elevation_profile, createdAt: t.created_at
          }));
          setTrails(mapped);
        } else {
          setTrails(getSavedTrails());
        }
      }
    }}>
      {children}
    </TrailContext.Provider>
  );
}

export function useTrails() {
  const context = useContext(TrailContext);
  if (!context) {
    throw new Error("useTrails doit être utilisé au sein de TrailProvider");
  }
  return context;
}
