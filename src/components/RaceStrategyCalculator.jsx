import React, { useState } from 'react';
import { calculateKmEffort, estimateDuration, calculateNutritionNeeds } from '../utils/trailCalculators';
import { Timer, Droplets, Zap, Activity, Calculator } from 'lucide-react';

export default function RaceStrategyCalculator({ trail }) {
  const [flatPaceMinPerKm, setFlatPaceMinPerKm] = useState(6.0); // 6:00 min/km = 10 km/h
  const [distanceKm, setDistanceKm] = useState(trail ? trail.distanceKm : 42);
  const [dPlus, setDPlus] = useState(trail ? trail.dPlus : 2500);

  const kmEffort = calculateKmEffort(distanceKm, dPlus);
  const durationEst = estimateDuration(distanceKm, dPlus, flatPaceMinPerKm);
  const durationHoursDecimal = durationEst.totalMinutes / 60;
  const nutrition = calculateNutritionNeeds(durationHoursDecimal);

  return (
    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
          <Calculator size={24} color="var(--primary-orange)" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            Calculateur de Temps de Course & Ravitaillement
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Estimation basée sur le Km-Effort (Règle de Naismith) et besoins en nutrition/eau.
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Distance (km)
          </label>
          <input
            type="number"
            value={distanceKm}
            onChange={e => setDistanceKm(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', fontWeight: 700 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Dénivelé D+ (m)
          </label>
          <input
            type="number"
            value={dPlus}
            onChange={e => setDPlus(parseInt(e.target.value) || 0)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', fontWeight: 700 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Allure de référence à plat (min/km)
          </label>
          <select
            value={flatPaceMinPerKm}
            onChange={e => setFlatPaceMinPerKm(parseFloat(e.target.value))}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', fontWeight: 700 }}
          >
            <option value={4.5}>4:30 min/km (13.3 km/h - Traileur Rapide)</option>
            <option value={5.0}>5:00 min/km (12 km/h - Régulier)</option>
            <option value={6.0}>6:00 min/km (10 km/h - Allure moyenne)</option>
            <option value={7.0}>7:00 min/km (8.5 km/h - Mode Ultra / Endurance)</option>
            <option value={8.5}>8:30 min/km (7 km/h - Randonnée rapide / Bivouac)</option>
          </select>
        </div>
      </div>

      {/* Result Metrics Cards */}
      <div className="stats-grid" style={{ marginBottom: 0 }}>
        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-value">{kmEffort} eKM</div>
            <div className="stat-label">Km-Effort Equivalent</div>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Timer size={24} />
          </div>
          <div>
            <div className="stat-value">{durationEst.formatted}</div>
            <div className="stat-label">Temps estimé de course</div>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
            <Droplets size={24} />
          </div>
          <div>
            <div className="stat-value">{nutrition.waterLiters} Litres</div>
            <div className="stat-label">Eau totale conseillée</div>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber-yellow)' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-value">{nutrition.carbsGrams} g</div>
            <div className="stat-label">Glucides (~{nutrition.caloriesKcal} kcal)</div>
          </div>
        </div>
      </div>

    </div>
  );
}
