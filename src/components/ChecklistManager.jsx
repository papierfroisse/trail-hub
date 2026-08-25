import React, { useState } from 'react';
import { Backpack, CheckSquare, Square, Scale, Plus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChecklistManager({ trail, equipmentList, onBack }) {
  const [items, setItems] = useState(() => {
    return equipmentList.map(item => ({
      ...item,
      isPacked: item.isPacked !== undefined ? item.isPacked : true
    }));
  });

  const toggleItemPacked = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, isPacked: !item.isPacked } : item));
  };

  const packedItems = items.filter(i => i.isPacked);
  const totalWeightGrams = packedItems.reduce((sum, i) => sum + (i.weightGrams || 0), 0);
  const baseWeightGrams = packedItems
    .filter(i => i.category !== 'Nutrition & Eau')
    .reduce((sum, i) => sum + (i.weightGrams || 0), 0);

  const completionPercentage = items.length > 0 ? Math.round((packedItems.length / items.length) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={18} /> Retour
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Avancement : <strong style={{ color: 'var(--emerald-green)' }}>{packedItems.length} / {items.length} ({completionPercentage}%)</strong>
          </span>
        </div>
      </div>

      {/* Title & Weight Summary */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Backpack size={28} color="var(--primary-orange)" />
          Checklist Sac à Dos : {trail ? trail.name : 'Préparation Course'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Cochez votre matériel avant le départ pour valider votre packlist et calculer le poids exact de votre sac.
        </p>

        {/* Progress Bar */}
        <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ height: '100%', width: `${completionPercentage}%`, background: 'linear-gradient(90deg, var(--primary-orange), var(--emerald-green))', transition: 'width 0.3s ease' }} />
        </div>

        {/* Weights */}
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
              <Scale size={24} />
            </div>
            <div>
              <div className="stat-value">{(baseWeightGrams / 1000).toFixed(2)} kg</div>
              <div className="stat-label">Poids de base du sac (hors eau/nourriture)</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
              <Scale size={24} />
            </div>
            <div>
              <div className="stat-value">{(totalWeightGrams / 1000).toFixed(2)} kg</div>
              <div className="stat-label">Poids total embarqué</div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={20} color="var(--emerald-green)" /> Éléments du Sac ({items.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItemPacked(item.id)}
              style={{
                padding: '0.9rem 1.25rem',
                borderRadius: '10px',
                background: item.isPacked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                border: item.isPacked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: item.isPacked ? 'var(--emerald-green)' : 'var(--text-muted)' }}>
                  {item.isPacked ? <CheckSquare size={22} /> : <Square size={22} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: item.isPacked ? '#fff' : 'var(--text-muted)', textDecoration: item.isPacked ? 'none' : 'line-through' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category}</div>
                </div>
              </div>

              <div style={{ fontWeight: 700, color: 'var(--emerald-green)', fontSize: '0.9rem' }}>
                {item.weightGrams} g
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
