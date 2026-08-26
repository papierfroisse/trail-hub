import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function TrailCalendar({ trails, onSelectTrail }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Noms des mois et jours
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Récupérer le premier jour du mois et le nombre de jours
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Ajuster car getDay() commence par Dimanche (0) et nous voulons Lundi (0)
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const numDays = new Date(year, month + 1, 0).getDate();

  // Créer la grille de jours pour le mois
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null); // Jours vides du mois précédent
  }
  for (let i = 1; i <= numDays; i++) {
    days.push(new Date(year, month, i));
  }

  // Filtrer les trails pour ce mois
  const trailsThisMonth = trails.filter(trail => {
    if (!trail.date) return false;
    const d = new Date(trail.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  // Calculer les statistiques du mois
  const monthlyKm = trailsThisMonth.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
  const monthlyDPlus = trailsThisMonth.reduce((sum, t) => sum + (t.dPlus || 0), 0);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTrailsForDay = (date) => {
    if (!date) return [];
    return trails.filter(trail => {
      if (!trail.date) return false;
      const tDate = new Date(trail.date);
      return tDate.getDate() === date.getDate() &&
             tDate.getMonth() === date.getMonth() &&
             tDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Calendar Header with Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              {monthNames[month]} {year}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {trailsThisMonth.length} événement(s) ce mois-ci
            </span>
          </div>
        </div>

        {/* Stats du mois */}
        <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Volume</span>
            <strong style={{ color: '#fff' }}>{Math.round(monthlyKm)} km</strong>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>D+ Total</span>
            <strong style={{ color: 'var(--emerald-green)' }}>+{monthlyDPlus.toLocaleString()} m</strong>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 1rem' }}>
            Aujourd'hui
          </button>
          <button onClick={nextMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        {/* Days of week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {dayNames.map(name => (
            <div key={name} style={{ padding: '0.5rem 0' }}>{name}</div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {days.map((date, idx) => {
            const isToday = date && new Date().toDateString() === date.toDateString();
            const dayTrails = getTrailsForDay(date);

            return (
              <div
                key={idx}
                style={{
                  minHeight: '90px',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: date ? (isToday ? 'rgba(249, 115, 22, 0.08)' : 'rgba(15, 23, 42, 0.4)') : 'transparent',
                  border: date ? (isToday ? '1px solid var(--primary-orange)' : '1px solid var(--border-color)') : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  position: 'relative'
                }}
              >
                {/* Day number */}
                {date && (
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: isToday ? 800 : 500, 
                    color: isToday ? 'var(--primary-orange)' : '#9ca3af',
                    alignSelf: 'flex-start'
                  }}>
                    {date.getDate()}
                  </span>
                )}

                {/* Day events (Trails) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden' }}>
                  {dayTrails.map(trail => {
                    const isCompleted = trail.status === 'Terminé';
                    const isWishlist = trail.status === 'Wishlist';
                    const badgeColor = isCompleted ? 'var(--emerald-green)' : isWishlist ? 'var(--purple-accent)' : 'var(--primary-orange)';

                    return (
                      <div
                        key={trail.id}
                        onClick={() => onSelectTrail(trail)}
                        title={`${trail.name} (${trail.distanceKm}km, +${trail.dPlus}m)`}
                        style={{
                          padding: '0.25rem 0.4rem',
                          borderRadius: '4px',
                          background: `${badgeColor}22`,
                          color: badgeColor,
                          borderLeft: `3px solid ${badgeColor}`,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          transition: 'transform 0.1s ease',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span style={{ color: '#fff', fontSize: '0.7rem', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {trail.name}
                        </span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                          {trail.distanceKm}km • +{trail.dPlus}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
