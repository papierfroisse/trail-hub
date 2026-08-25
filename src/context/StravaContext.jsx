import React, { createContext, useContext, useState, useEffect } from 'react';

const StravaContext = createContext();

export function StravaProvider({ children }) {
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  const [stravaAthlete, setStravaAthlete] = useState(null);

  // Charger le statut sauvegardé localement au démarrage
  useEffect(() => {
    const savedConnection = localStorage.getItem('strava_connected') === 'true';
    const savedAthlete = localStorage.getItem('strava_athlete');
    
    if (savedConnection && savedAthlete) {
      setIsStravaConnected(true);
      setStravaAthlete(JSON.parse(savedAthlete));
    }
  }, []);

  const connectStrava = () => {
    // Simuler le flux OAuth2 Strava
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyAthlete = {
          firstname: 'Nicolas',
          lastname: 'Randonneur',
          profile: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces', // Jolie photo de traileur
          city: 'Chamonix',
          premium: true
        };
        
        setIsStravaConnected(true);
        setStravaAthlete(dummyAthlete);
        
        localStorage.setItem('strava_connected', 'true');
        localStorage.setItem('strava_athlete', JSON.stringify(dummyAthlete));
        
        resolve(dummyAthlete);
      }, 1000); // 1 seconde de chargement pour faire authentique
    });
  };

  const disconnectStrava = () => {
    setIsStravaConnected(false);
    setStravaAthlete(null);
    localStorage.removeItem('strava_connected');
    localStorage.removeItem('strava_athlete');
  };

  return (
    <StravaContext.Provider value={{ isStravaConnected, stravaAthlete, connectStrava, disconnectStrava }}>
      {children}
    </StravaContext.Provider>
  );
}

export function useStrava() {
  const context = useContext(StravaContext);
  if (!context) {
    throw new Error('useStrava doit être utilisé au sein d\'un StravaProvider');
  }
  return context;
}
