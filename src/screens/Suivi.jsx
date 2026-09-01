import { useState } from 'react';
import { STEPS, LOG, REPAIR_QUOTE, fmt } from '../data.js';
import { useOrderLookup } from '../useOrders.js';

const ORDER_STEPS = ['Nouvelle', 'En préparation', 'En livraison', 'Livrée'];

function OrderTracking() {
  const [ref, setRef] = useState('');
  const { order, status, lookup } = useOrderLookup();

  const submit = (e) => {
    e.preventDefault();
    if (ref.trim()) lookup(ref);
  };

  const stepIndex = order ? ORDER_STEPS.indexOf(order.status) : -1;

  return (
    <section>
      <h1 style={{ marginBottom: 6 }}>Suivi de commande</h1>
      <div style={{ opacity: 0.65, fontSize: 14, marginBottom: 30 }}>
        Entrez la référence reçue à la validation de votre commande pour suivre sa livraison.
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: 10, maxWidth: 460, marginBottom: 30 }}>
        <input
          className="input"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Référence de commande"
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Recherche…' : 'Rechercher'}
        </button>
      </form>

      {status === 'not-found' && (
        <div className="notice" style={{ maxWidth: 460, color: 'var(--color-accent-2-700)' }}>
          Aucune commande ne correspond à cette référence. Vérifiez qu'elle est copiée sans espace ni erreur.
        </div>
      )}
      {status === 'error' && (
        <div className="notice" style={{ maxWidth: 460, color: 'var(--color-accent-2-700)' }}>
          Impossible de vérifier la commande pour le moment. Réessayez dans un instant.
        </div>
      )}

      {order && status === 'found' && (
        <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', marginBottom: 30 }}>
              {ORDER_STEPS.map((s, i) => (
                <div key={s} style={{ flex: 1, minWidth: 130, paddingRight: 18 }}>
                  <div style={{ height: 3, marginBottom: 10, background: i <= stepIndex ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 14%, transparent)' }} />
                  <div className="mini-heading" style={{ opacity: i <= stepIndex ? 1 : 0.5 }}>{s}</div>
                </div>
              ))}
            </div>
            <h5 style={{ marginBottom: 12 }}>Articles commandés</h5>
            <table className="table">
              <thead><tr><th>Article</th><th style={{ width: 80 }}>Qté</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td style={{ textAlign: 'right' }}>{fmt(it.price * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h5>Livraison</h5>
            <div style={{ fontSize: 14 }}>{order.customer.name} · {order.customer.phone}</div>
            <div style={{ fontSize: 14, opacity: 0.72 }}>{order.customer.commune} — {order.customer.address}</div>
            <div className="total-due-row" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 20, marginTop: 6 }}>
              <span>Total</span><span>{fmt(order.total)}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Paiement par {order.payment_method}, réglé à la livraison.</div>
          </aside>
        </div>
      )}
    </section>
  );
}

function RepairTicket({ st, advanceStep }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
        <h1 style={{ margin: 0 }}>Ticket NG-M-2481</h1>
        <span className="tag tag-accent-2">{STEPS[st.step].label}</span>
      </div>
      <div style={{ opacity: 0.65, fontSize: 14, marginBottom: 30 }}>
        Dell OptiPlex 7010 SFF · client Cabinet Koffi &amp; Fils · déposé le 24 août, 09:40 · technicien Aliou N.
      </div>

      <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', marginBottom: 36 }}>
        {STEPS.map((s, i) => (
          <div key={s.label} style={{ flex: 1, minWidth: 130, paddingRight: 18 }}>
            <div style={{ height: 3, marginBottom: 10, background: i <= st.step ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 14%, transparent)' }} />
            <div className="mini-heading" style={{ opacity: i <= st.step ? 1 : 0.5 }}>{s.label}</div>
            <div style={{ fontSize: 12, opacity: 0.55 }}>{s.when}</div>
          </div>
        ))}
      </div>

      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
        <div>
          <h5 style={{ marginBottom: 14 }}>Journal d'intervention</h5>
          {LOG.map((e) => (
            <div key={e.when + e.title} style={{ display: 'flex', gap: 18, paddingBottom: 16 }}>
              <div style={{ width: 96, flex: 'none', fontSize: 12, opacity: 0.55 }}>{e.when}</div>
              <div style={{ flex: 1 }}>
                <div className="mini-heading">{e.title}</div>
                <div style={{ fontSize: 13, opacity: 0.72 }}>{e.body}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={advanceStep} disabled={st.step >= STEPS.length - 1}>Passer à l'étape suivante</button>
            <button className="btn btn-secondary" onClick={() => window.print()}>Imprimer le bon de travail</button>
          </div>
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h5>Devis de réparation</h5>
          <table className="table">
            <tbody>
              {REPAIR_QUOTE.map((r) => (
                <tr key={r.label}><td>{r.label}</td><td style={{ textAlign: 'right' }}>{r.amount}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="total-due-row" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 20, marginTop: 6 }}>
            <span>Total</span><span>49 000 FCFA</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Validé par le client le 25 août à 11:05 par SMS. Paiement à la restitution.</div>
        </aside>
      </div>
    </section>
  );
}

export default function Suivi({ st, advanceStep }) {
  if (st.role === 'Client') return <OrderTracking />;
  return <RepairTicket st={st} advanceStep={advanceStep} />;
}
