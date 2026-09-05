import { useState } from 'react';
import { PRODUCTS, fmt, discountOf } from '../data.js';
import { StockTag } from './Boutique.jsx';
import { useProductReviews, submitReview } from '../useReviews.js';
import Stars from '../components/Stars.jsx';

const WHATSAPP_HREF = 'https://wa.me/2250101103701?text=' + encodeURIComponent('Bonjour NG-Shop, j\'aimerais avoir des informations.');

const EMPTY_REVIEW = { customerName: '', rating: 0, comment: '' };

export default function Produit({ st, go, addToCart }) {
  const current = PRODUCTS.find((p) => p.id === st.pid) || PRODUCTS[0];
  const { percent, oldPrice } = discountOf(current);
  const { reviews, loading: reviewsLoading, average, count } = useProductReviews(current.id);
  const [form, setForm] = useState(EMPTY_REVIEW);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const submitReviewForm = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.customerName.trim() || !form.rating) {
      setError('Merci d\'indiquer votre nom et une note de 1 à 5 étoiles.');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview({ productId: current.id, customerName: form.customerName.trim(), rating: form.rating, comment: form.comment });
      setSent(true);
      setForm(EMPTY_REVIEW);
    } catch {
      setError("L'avis n'a pas pu être envoyé. Vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <button className="btn btn-ghost" onClick={() => go('boutique')} style={{ paddingLeft: 0, marginBottom: 18 }}>
        ← Retour au catalogue
      </button>
      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
        <div className="photo" style={{ aspectRatio: '4/3', position: 'relative' }}>
          <span className="discount-badge">-{percent}%</span>
          {current.image ? <img src={current.image} alt={current.name} /> : 'Photo produit'}
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 }}>
            {current.cat} · réf. {current.code}
          </div>
          <h1 className="product-title">{current.name}</h1>
          {count > 0 && (
            <div className="rating-summary" style={{ marginBottom: 8 }}>
              <Stars value={average} />
              <span>{average.toFixed(1)}/5</span>
              <span className="rating-count">({count} avis)</span>
            </div>
          )}
          <p style={{ opacity: 0.78 }}>{current.blurb}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', margin: '20px 0 4px' }}>
            <div className="product-title-price">{fmt(current.price)}</div>
            <span className="product-oldprice" style={{ fontSize: 16 }}>{fmt(oldPrice)}</span>
            <StockTag p={current} />
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>Prix TTC · TVA 18 % incluse · garantie atelier 12 mois</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <button className="btn btn-primary btn-pill" onClick={() => addToCart(current.id)}>Ajouter au panier</button>
            <button className="btn btn-secondary" onClick={() => go('panier')}>Voir le panier</button>
            <button className="btn btn-secondary" onClick={() => go('maintenance')}>Demander l'installation</button>
          </div>

          <div className="seller-block">
            <div className="seller-block-name">Vendu et livré par NG-Shop</div>
            <ul className="seller-block-list">
              <li>Garantie atelier 12 mois sur ce produit</li>
              <li>Retrait en boutique à Abidjan ou livraison sur rendez-vous</li>
              <li>Une question avant d'acheter ? <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">Écrivez-nous sur WhatsApp</a></li>
            </ul>
          </div>

          <h5 style={{ marginBottom: 8 }}>Caractéristiques</h5>
          <table className="table">
            <tbody>
              {current.specs.map((s) => (
                <tr key={s.k}>
                  <td style={{ width: '38%', opacity: 0.6 }}>{s.k}</td>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{s.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 44, alignItems: 'start', marginTop: 40 }}>
        <div>
          <h5 style={{ marginBottom: 12 }}>Avis clients {count > 0 && `(${count})`}</h5>
          {reviewsLoading ? (
            <div style={{ opacity: 0.6, fontSize: 14 }}>Chargement…</div>
          ) : reviews.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: 14 }}>Aucun avis pour le moment. Soyez le premier à donner votre avis.</p>
          ) : (
            reviews.map((r) => (
              <div className="review-card" key={r.id}>
                <div className="review-card-head">
                  <span className="review-card-name">{r.customer_name}</span>
                  <Stars value={r.rating} size={13} />
                </div>
                <div className="review-card-date">{new Date(r.created_at).toLocaleDateString('fr-FR')}</div>
                {r.comment && <div className="review-card-comment">{r.comment}</div>}
              </div>
            ))
          )}
        </div>

        <div>
          <h5 style={{ marginBottom: 12 }}>Donner votre avis</h5>
          {sent ? (
            <div className="notice">Merci, votre avis a bien été envoyé et sera visible après validation par NG-Shop.</div>
          ) : (
            <form onSubmit={submitReviewForm} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
              <div className="field">
                <label>Votre nom</label>
                <input className="input" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} placeholder="Votre nom" />
              </div>
              <div className="field">
                <label>Votre note</label>
                <div className="rating-picker">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={form.rating >= n ? 'filled' : ''}
                      onClick={() => setForm((f) => ({ ...f, rating: n }))}
                      aria-label={n + ' étoile' + (n > 1 ? 's' : '')}
                    >
                      {form.rating >= n ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Commentaire (facultatif)</label>
                <textarea className="input" rows={3} value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Envoi en cours…' : 'Envoyer mon avis'}
              </button>
              {error && <div className="notice" style={{ color: 'var(--color-accent-2-700)' }}>{error}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
