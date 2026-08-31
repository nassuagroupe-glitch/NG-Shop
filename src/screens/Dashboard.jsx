import { KPIS, SALES, LOW_STOCK_IDS, PRODUCTS } from '../data.js';
import { StockInline } from './Boutique.jsx';

export default function Dashboard() {
  const lowStock = LOW_STOCK_IDS.map((id) => PRODUCTS.find((p) => p.id === id));

  return (
    <section>
      <h1 style={{ marginBottom: 6 }}>Tableau de bord</h1>
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
          <h5 style={{ marginBottom: 12 }}>Dernières ventes</h5>
          <table className="table">
            <thead><tr><th>Pièce</th><th>Client</th><th>Canal</th><th style={{ textAlign: 'right' }}>Montant</th></tr></thead>
            <tbody>
              {SALES.map((s) => (
                <tr key={s.ref}>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{s.ref}</td>
                  <td>{s.client}</td>
                  <td><span className="tag tag-neutral">{s.canal}</span></td>
                  <td style={{ textAlign: 'right' }}>{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </section>
  );
}
