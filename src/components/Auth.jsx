import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Auth({ onClose }) {
  const { signIn, signUp, signInWithGoogle, isConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isConfigured) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '450px', margin: '2rem auto', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--primary-orange)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
          Mode Stockage Local
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          Supabase n'est pas encore configuré sur ce projet. L'application enregistre actuellement vos données dans votre navigateur (LocalStorage).
        </p>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'left', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '2rem' }}>
          <strong>Pour l'administrateur :</strong>
          <ol style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>Créez un projet sur supabase.com</li>
            <li>Renommez le fichier <code>.env.example</code> en <code>.env</code></li>
            <li>Renseignez vos clés API dans le fichier <code>.env</code></li>
          </ol>
        </div>
        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
          Continuer en mode invité
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, { full_name: fullName });
        setSuccess('Inscription réussie ! Un email de confirmation a été envoyé si configuré.');
        // Réinitialiser les champs
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        await signIn(email, password);
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion Google.');
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '450px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {isSignUp ? 'Rejoindre TrailHub' : 'Connexion'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {isSignUp ? 'Synchronisez vos données sur tous vos appareils' : 'Accédez à vos itinéraires et votre équipement'}
        </p>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#ef4444', fontSize: '0.9rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--emerald-green)', fontSize: '0.9rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {isSignUp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Nom complet</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                required
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Adresse email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
          {loading ? 'Chargement...' : isSignUp ? "S'inscrire" : 'Se connecter'}
          {!loading && <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>OU</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
      </div>

      <button onClick={handleGoogleLogin} className="btn btn-secondary" style={{ width: '100%', background: '#fff', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Continuer avec Google
      </button>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#9ca3af' }}>
        {isSignUp ? (
          <>
            Déjà un compte ?{' '}
            <button onClick={() => setIsSignUp(false)} style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Se connecter
            </button>
          </>
        ) : (
          <>
            Nouveau sur TrailHub ?{' '}
            <button onClick={() => setIsSignUp(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-orange)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Créer un compte
            </button>
          </>
        )}
      </div>
    </div>
  );
}
