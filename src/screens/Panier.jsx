import { useState } from 'react';
import { PRODUCTS, PAYMENTS, COMMUNES, fmt } from '../data.js';
import { createOrder } from '../useOrders.js';

const EMPTY_CUSTOMER = { name: '', phone: '', commune: COMMUNES[0], address: '', notes: '' };

export default function Panier({ st, go, incCart, decCart, removeCart, setPay, clearCart }) {
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  const cartLines = Object.keys(st.cart).map((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    const qty = st.cart[id];
    return { id, p, qty };
  });
  const ttc = cartLines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const ht = Math.round(ttc / 1.18);
  const tva = ttc - ht;
  const port = ttc ? 3000 : 0;
  const total = ttc + port;

  const setField = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }));

  const handleCheckout = async () => {
    setOrderError(null);
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setOrderError('Merci de renseigner votre nom, votre téléphone et votre adresse de livraison.');
      return;
    }
    setSubmitting(true);
    try {
      const id = await createOrder({
        customer,
        items: cartLines.map((l) => ({ id: l.id, name: l.p.name, price: l.p.price, qty: l.qty, code: l.p.code })),
        paymentMethod: st.pay,
        subtotalHT: ht,
        tva,
        deliveryFee: port,
        total
      });
      setOrderResult({ id, total });
      clearCart();
      setCustomer(EMPTY_CUSTOMER);
    } catch {
      setOrderError("La commande n'a pas pu être enregistrée. Vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 style={{ marginBottom: 24 }}>Panier &amp; commande</h1>

      {cartLines.length === 0 ? (
        <div style={{ maxWidth: 460 }}>
          {orderResult ? (
            <div className="notice" style={{ marginBottom: 20 }}>
              Commande enregistrée, référence <strong style={{ fontWeight: 600 }}>{orderResult.id}</strong> — total {fmt(orderResult.total)}.
              Conservez cette référence pour suivre votre livraison depuis l'écran Suivi.
            </div>
          ) : (
            <p style={{ opacity: 0.7 }}>
              Votre panier est vide. Parcourez le catalogue pour ajouter du matériel, ou demandez directement une
              intervention de maintenance.
            </p>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => go('boutique')}>Voir le catalogue</button>
            <button className="btn btn-secondary" onClick={() => go('maintenance')}>Maintenance</button>
          </div>
        </div>
      ) : (
        <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
          <div>
            <table className="table">
              <thead>
                <tr><th>Article</th><th style={{ width: 120 }}>Qté</th><th style={{ textAlign: 'right' }}>Total</th><th style={{ width: 36 }} /></tr>
              </thead>
              <tbody>
                {cartLines.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{l.p.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.55 }}>{fmt(l.p.price)} · réf. {l.p.code}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button className="btn btn-secondary" onClick={() => decCart(l.id)} style={{ width: 28, height: 28, padding: 0 }}>−</button>
                        <span style={{ minWidth: 16, textAlign: 'center' }}>{l.qty}</span>
                        <button className="btn btn-secondary" onClick={() => incCart(l.id)} style={{ width: 28, height: 28, padding: 0 }}>+</button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{fmt(l.p.price * l.qty)}</td>
                    <td><button className="btn btn-ghost" onClick={() => removeCart(l.id)} style={{ color: 'var(--color-accent-2-700)' }}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 34 }}>
              <h5 style={{ marginBottom: 12 }}>Livraison</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 520 }}>
                <div className="field">
                  <label>Nom complet</label>
                  <input className="input" value={customer.name} onChange={setField('name')} placeholder="Votre nom" />
                </div>
                <div className="field">
                  <label>Téléphone</label>
                  <input className="input" value={customer.phone} onChange={setField('phone')} placeholder="07 00 00 00 00" />
                </div>
                <div className="field">
                  <label>Commune</label>
                  <select className="input" value={customer.commune} onChange={setField('commune')}>
                    {COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Adresse précise</label>
                  <input className="input" value={customer.address} onChange={setField('address')} placeholder="Quartier, rue, repère" />
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>Note pour le livreur (facultatif)</label>
                  <textarea className="input" value={customer.notes} onChange={setField('notes')} rows={2} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <h5 style={{ marginBottom: 12 }}>Paiement à la livraison</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420 }}>
                {PAYMENTS.map((m) => (
                  <button
                    key={m.id}
                    className={'choice-row' + (st.pay === m.id ? ' active' : '')}
                    onClick={() => setPay(m.id)}
                  >
                    <span className="choice-dot" />
                    <span style={{ flex: 1, textAlign: 'left' }}>{m.id}</span>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{m.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h5>Récapitulatif</h5>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ opacity: 0.65 }}>Sous-total HT</span><span>{fmt(ht)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ opacity: 0.65 }}>TVA 18 %</span><span>{fmt(tva)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ opacity: 0.65 }}>Livraison Abidjan</span><span>{port ? fmt(port) : 'offerte'}</span></div>
            <div className="total-due-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22 }}>
              <span>À payer à la livraison</span><span>{fmt(total)}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Paiement par {st.pay}, réglé directement au livreur.</div>
            <button className="btn btn-primary btn-block" onClick={handleCheckout} disabled={submitting}>
              {submitting ? 'Envoi en cours…' : 'Valider la commande'}
            </button>
            <button className="btn btn-secondary btn-block" onClick={() => window.print()}>Imprimer le devis</button>
            {orderError && (
              <div className="notice" style={{ marginTop: 6, color: 'var(--color-accent-2-700)' }}>{orderError}</div>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
