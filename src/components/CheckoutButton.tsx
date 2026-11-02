import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  plan: 'family' | 'school';
  label: string;
  className?: string;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ plan, label, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        if (data.error === 'price_not_configured') {
          setError('Paiement non encore configuré. Contactez-nous.');
        } else {
          setError('Erreur, réessayez.');
        }
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Connexion impossible, réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          : <Sparkles className="w-4 h-4 shrink-0" />
        }
        {loading ? 'Redirection...' : label}
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
};
