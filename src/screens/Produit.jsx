import { PRODUCTS, fmt } from '../data.js';
import { StockTag } from './Boutique.jsx';

export default function Produit({ st, go, addToCart }) {
  const current = PRODUCTS.find((p) => p.id === st.pid) || PRODUCTS[0];

  return (
    <section>
      <button className="btn btn-ghost" onClick={() => go('boutique')} style={{ paddingLeft: 0, marginBottom: 18 }}>
        ← Retour au catalogue
      </button>
      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
        <div className="photo" style={{ aspectRatio: '4/3' }}>
          {current.image ? <img src={current.image} alt={current.name} /> : 'Photo produit'}
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 8 }}>
            {current.cat} · réf. {current.code}
          </div>
          <h1 className="product-title">{current.name}</h1>
          <p style={{ opacity: 0.78 }}>{current.blurb}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '20px 0 4px' }}>
            <div className="product-title-price">{fmt(current.price)}</div>
            <StockTag p={current} />
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>Prix TTC · TVA 18 % incluse · garantie atelier 12 mois</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
            <button className="btn btn-primary" onClick={() => addToCart(current.id)}>Ajouter au panier</button>
            <button className="btn btn-secondary" onClick={() => go('panier')}>Voir le panier</button>
            <button className="btn btn-secondary" onClick={() => go('maintenance')}>Demander l'installation</button>
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
    </section>
  );
}
