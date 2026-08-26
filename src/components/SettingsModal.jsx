import React from 'react';
import { exportAllDataJSON, importAllDataJSON } from '../utils/storage';
import { Download, Upload, X, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onReloadData }) {
  if (!isOpen) return null;

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importAllDataJSON(event.target.result);
      alert(res.message);
      if (res.success) {
        onReloadData();
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem'
    }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', background: '#1e293b' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Options & Sauvegardes</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} color="var(--primary-orange)" /> Sauvegarde Externe
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Téléchargez l'intégralité de vos trails, itinéraires multi-GR et votre matériel sous forme de fichier JSON.
            </p>
            <button onClick={exportAllDataJSON} className="btn btn-primary btn-sm">
              Télécharger la Sauvegarde JSON
            </button>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} color="var(--emerald-green)" /> Restauration de Sauvegarde
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Restaurez vos données enregistrées à partir d'un fichier .JSON.
            </p>
            
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              id="import-json-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="import-json-input" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              Sélectionner un fichier JSON
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-green)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <ShieldCheck size={16} /> Vos données restent 100% locales et privées dans votre navigateur.
          </div>

        </div>

      </div>
    </div>
  );
}
