import { useState } from 'react';
import { KPIS, LOW_STOCK_IDS, PRODUCTS, fmt } from '../data.js';
import { StockInline } from './Boutique.jsx';
import { useAuth } from '../useAuth.js';
import { useOrdersList, updateOrderStatus } from '../useOrders.js';
import { useReviewsModeration, approveReview, deleteReview } from '../useReviews.js';
import Stars from '../components/Stars.jsx';

const ORDER_STATUSES = ['Nouvelle', 'En préparation', 'En livraison', 'Livrée', 'Annulée'];

function LoginGate({ signIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Identifiants incorrects.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 style={{ marginBottom: 6 }}>Tableau de bord</h1>
      <div style={{ opacity: 0.65, fontSize: 14, marginBottom: 30 }}>Réservé au gérant. Connectez-vous pour accéder aux commandes.</div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
        {error && <div className="notice" style={{ color: 'var(--color-accent-2-700)' }}>{error}</div>}
      </form>
    </section>
  );
}

export default function Dashboard() {
  const { user, ready, signIn, signOutUser } = useAuth();
  const { orders, loading } = useOrdersList();
  const { reviews, loading: reviewsLoading } = useReviewsModeration();
  const pendingReviews = reviews.filter((r) => !r.approved);
  const lowStock = LOW_STOCK_IDS.map((id) => PRODUCTS.find((p) => p.id === id));

  if (!ready) return null;
  if (!user) return <LoginGate signIn={signIn} />;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ marginBottom: 6 }}>Tableau de bord</h1>
        <button className="btn btn-ghost" onClick={signOutUser}>Se déconnecter</button>
      </div>
      <div style={{ opacity: 0.65, fontSize: 14, marginBottom: 34 }}>Mercredi 26 août · boutique Plateau &amp; atelier · 2 caisses ouvertes</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 34, maxWidth: 900, marginBottom: 48 }}>
        {KPIS.map((k) => (
          <div key={k.label}>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginTop: 12 }}>{k.label}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
        <div>
          <h5 style={{ marginBottom: 12 }}>Commandes en ligne</h5>
          {loading ? (
            <div style={{ opacity: 0.6, fontSize: 14 }}>Chargement…</div>
          ) : orders.length === 0 ? (
            <div style={{ opacity: 0.6, fontSize: 14 }}>Aucune commande pour le moment.</div>
          ) : (
            <table className="table">
              <thead><tr><th>Réf.</th><th>Client</th><th>Téléphone</th><th>Commune</th><th style={{ textAlign: 'right' }}>Montant</th><th>Statut</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{o.id.slice(0, 8)}</td>
                    <td>{o.customer?.name}</td>
                    <td>{o.customer?.phone}</td>
                    <td>{o.customer?.commune}</td>
                    <td style={{ textAlign: 'right' }}>{fmt(o.total)}</td>
                    <td>
                      <select
                        className="input"
                        style={{ padding: '4px 8px', fontSize: 13 }}
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <aside>
          <h5 style={{ marginBottom: 12 }}>Stock à surveiller</h5>
          {lowStock.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', paddingBottom: 12 }}>
              <div>
                <div className="mini-heading">{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>réf. {p.code}</div>
              </div>
              <StockInline p={p} />
            </div>
          ))}
          <button className="btn btn-secondary" style={{ marginTop: 10 }}>Générer le bon de commande</button>
        </aside>
      </div>

      <div style={{ marginTop: 48 }}>
        <h5 style={{ marginBottom: 12 }}>Avis clients à modérer {pendingReviews.length > 0 && `(${pendingReviews.length})`}</h5>
        {reviewsLoading ? (
          <div style={{ opacity: 0.6, fontSize: 14 }}>Chargement…</div>
        ) : pendingReviews.length === 0 ? (
          <div style={{ opacity: 0.6, fontSize: 14 }}>Aucun avis en attente de validation.</div>
        ) : (
          <table className="table">
            <thead><tr><th>Produit</th><th>Client</th><th>Note</th><th>Commentaire</th><th style={{ width: 160 }} /></tr></thead>
            <tbody>
              {pendingReviews.map((r) => {
                const product = PRODUCTS.find((p) => p.id === r.product_id);
                return (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{product ? product.name : r.product_id}</td>
                    <td>{r.customer_name}</td>
                    <td><Stars value={r.rating} size={13} /></td>
                    <td style={{ maxWidth: 260 }}>{r.comment}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => approveReview(r.id)}>Approuver</button>
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 13, color: 'var(--color-accent-2-700)' }} onClick={() => deleteReview(r.id)}>Rejeter</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
