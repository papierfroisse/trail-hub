import React, { useState } from 'react';
import { Backpack, Plus, Trash2, Scale, Tag } from 'lucide-react';

export default function EquipmentManager({ equipmentList, onSaveEquipment }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Chaussures');
  const [weightGrams, setWeightGrams] = useState('');
  const [notes, setNotes] = useState('');

  const CATEGORIES = [
    'Chaussures',
    'Sac & Hydratation',
    'Vêtements',
    'Bivouac',
    'Électronique',
    'Secours & Pharmacie',
    'Nutrition & Eau'
  ];

  // Calcul du poids total de base (en excluant eau et nutrition consommables)
  const totalBaseWeightGrams = equipmentList
    .filter(i => i.category !== 'Nutrition & Eau')
    .reduce((sum, item) => sum + (item.weightGrams || 0), 0);

  const totalWeightGramsWithConsumables = equipmentList
    .reduce((sum, item) => sum + (item.weightGrams || 0), 0);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!name) return;

    const newItem = {
      id: `gear-${Date.now()}`,
      name,
      category,
      weightGrams: parseInt(weightGrams) || 0,
      isPacked: true,
      notes
    };

    onSaveEquipment([...equipmentList, newItem]);

    setName('');
    setWeightGrams('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    const updated = equipmentList.filter(item => item.id !== id);
    onSaveEquipment(updated);
  };

  const filteredItems = equipmentList.filter(item => activeCategory === 'ALL' || item.category === activeCategory);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Backpack size={28} color="var(--primary-orange)" />
            Gestion du Matériel & Équipement
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Renseignez votre équipement de trail/trek pour calculer le poids de votre sac à dos.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Ajouter un Équipement</span>
        </button>
      </div>

      {/* Weight Summary Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
            <Scale size={24} />
          </div>
          <div>
            <div className="stat-value">{(totalBaseWeightGrams / 1000).toFixed(2)} kg</div>
            <div className="stat-label">Poids de Base du Sac (hors eau/nourriture)</div>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
            <Scale size={24} />
          </div>
          <div>
            <div className="stat-value">{(totalWeightGramsWithConsumables / 1000).toFixed(2)} kg</div>
            <div className="stat-label">Poids Total avec eau & consommables</div>
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Tag size={24} />
          </div>
          <div>
            <div className="stat-value">{equipmentList.length} Éléments</div>
            <div className="stat-label">Articles en inventaire</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`btn btn-sm ${activeCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Tous ({equipmentList.length})
        </button>

        {CATEGORIES.map(cat => {
          const count = equipmentList.filter(i => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Equipment List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredItems.map(item => (
          <div key={item.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-orange">{item.category}</span>
                <span style={{ fontWeight: 800, color: 'var(--emerald-green)', fontSize: '0.95rem' }}>
                  {item.weightGrams} g
                </span>
              </div>

              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                {item.name}
              </h4>

              {item.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.notes}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--red-accent)', padding: '0.3rem 0.6rem' }}
              >
                <Trash2 size={15} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', background: '#1e293b' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Ajouter un Équipement
            </h3>

            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Nom du matériel</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Veste Gore-Tex 10k/10k"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Catégorie</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Poids (en grammes)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 240"
                    value={weightGrams}
                    onChange={e => setWeightGrams(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Notes</label>
                <textarea
                  rows="2"
                  placeholder="Notes, caractéristiques..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary btn-sm">Annuler</button>
                <button type="submit" className="btn btn-primary btn-sm">Ajouter l'équipement</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
