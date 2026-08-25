import React from 'react';
import { Mountain, Compass, MapPin, Backpack, LayoutDashboard, Settings, Layers, Route } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings }) {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'gr-catalog', label: 'Les Grands GR', icon: Compass },
    { id: 'multi-gr-planner', label: 'Planificateur Multi-GR', icon: Route },
    { id: 'trails', label: 'Mes Trails & GPX', icon: MapPin },
    { id: 'equipment', label: 'Équipement & Sac', icon: Backpack },
  ];

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
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

        {/* Action Button: Backup/Settings */}
        <div>
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary btn-sm"
            title="Options & Sauvegardes"
          >
            <Settings size={18} />
            <span>Options</span>
          </button>
        </div>

      </div>
    </header>
  );
}
