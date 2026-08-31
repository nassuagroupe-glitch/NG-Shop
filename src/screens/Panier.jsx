import { PRODUCTS, PAYMENTS, fmt } from '../data.js';

export default function Panier({ st, go, incCart, decCart, removeCart, setPay, checkout }) {
  const cartLines = Object.keys(st.cart).map((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    const qty = st.cart[id];
    return { id, p, qty };
  });
  const ttc = cartLines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const ht = Math.round(ttc / 1.18);
  const tva = ttc - ht;
  const port = ttc ? 3000 : 0;

  return (
    <section>
      <h1 style={{ marginBottom: 24 }}>Panier &amp; commande</h1>

      {cartLines.length === 0 ? (
        <div style={{ maxWidth: 460 }}>
          <p style={{ opacity: 0.7 }}>
            Votre panier est vide. Parcourez le catalogue pour ajouter du matériel, ou demandez directement une
            intervention de maintenance.
          </p>
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
              <h5 style={{ marginBottom: 12 }}>Paiement</h5>
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
              <span>À payer</span><span>{fmt(ttc + port)}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Paiement par {st.pay}. Un ticket de caisse et une facture PDF sont générés à la validation.</div>
            <button className="btn btn-primary btn-block" onClick={checkout}>Valider la commande</button>
            <button className="btn btn-secondary btn-block" onClick={() => window.print()}>Imprimer le devis</button>
            {st.orderDone && (
              <div className="notice" style={{ marginTop: 6 }}>
                Commande <strong style={{ fontWeight: 600 }}>NG-C-3391</strong> enregistrée. Facture prête à imprimer.
              </div>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
