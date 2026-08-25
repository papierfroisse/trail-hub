import React, { useState } from 'react';
import { Mountain, Compass, MapPin, Backpack, LayoutDashboard, Settings, Route, LogIn, LogOut, User, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStrava } from '../context/StravaContext';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, onOpenAuth }) {
  const { user, signOut, isConfigured } = useAuth();
  const { isStravaConnected, stravaAthlete, connectStrava, disconnectStrava } = useStrava();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStravaDropdown, setShowStravaDropdown] = useState(false);
  const [connectingStrava, setConnectingStrava] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'gr-catalog', label: 'Les Grands GR', icon: Compass },
    { id: 'bike-routes', label: 'Véloroutes & Voies Vertes', icon: Route },
    { id: 'multi-gr-planner', label: 'Planificateur Multi-GR', icon: Route },
    { id: 'trails', label: 'Mes Trails & GPX', icon: MapPin },
    { id: 'equipment', label: 'Équipement & Sac', icon: Backpack },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header style={{ background: '#0f172a', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #f97316, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)' }}>
            <Mountain size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', color: '#fff' }}>
              Trail<span style={{ color: 'var(--primary-orange)' }}>Hub</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Organisation & Multi-GR
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                  color: isActive ? 'var(--primary-orange)' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary-orange)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button: Backup/Settings/Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          
          {/* Strava Connection Button */}
          <div style={{ position: 'relative' }}>
            {isStravaConnected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowStravaDropdown(!showStravaDropdown)}
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: '#fc5200',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem'
                  }}
                  title={`Connecté en tant que ${stravaAthlete?.firstname}`}
                >
                  {stravaAthlete?.profile ? (
                    <img 
                      src={stravaAthlete.profile} 
                      alt="Avatar" 
                      style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #fc5200' }}
                    />
                  ) : (
                    <Activity size={16} />
                  )}
                  <span>Strava</span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                </button>

                {showStravaDropdown && (
                  <div className="glass-card" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '200px',
                    padding: '0.75rem',
                    zIndex: 110,
                    background: '#1f2937',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      Athlète : <strong>{stravaAthlete?.firstname} {stravaAthlete?.lastname}</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stravaAthlete?.city || 'France'}</span>
                    </div>
                    <button
                      onClick={() => {
                        disconnectStrava();
                        setShowStravaDropdown(false);
                      }}
                      className="btn btn-secondary btn-xs"
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', width: '100%' }}
                    >
                      Déconnecter Strava
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={async () => {
                  setConnectingStrava(true);
                  await connectStrava();
                  setConnectingStrava(false);
                }}
                disabled={connectingStrava}
                className="btn btn-secondary btn-sm"
                style={{
                  background: 'rgba(249, 115, 22, 0.05)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Activity size={16} color="#6b7280" />
                <span>{connectingStrava ? 'Connexion...' : 'Lier Strava'}</span>
              </button>
            )}
          </div>

          <button
            onClick={onOpenSettings}
            className="btn btn-secondary btn-sm"
            title="Options & Sauvegardes"
          >
            <Settings size={18} />
            <span>Options</span>
          </button>

          {user ? (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="btn btn-primary btn-sm"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <User size={18} />
                <span>{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>

              {showDropdown && (
                <div className="glass-card" style={{ position: 'absolute', right: 0, top: '45px', padding: '0.5rem', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 101, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Connecté : <br /><strong>{user.email}</strong>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444', border: 'none', background: 'transparent' }}
                  >
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
            >
              <LogIn size={18} />
              <span>{isConfigured ? 'Connexion' : 'Mode Local'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
