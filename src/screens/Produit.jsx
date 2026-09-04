import { PRODUCTS, fmt, discountOf } from '../data.js';
import { StockTag } from './Boutique.jsx';

const WHATSAPP_HREF = 'https://wa.me/2250101103701?text=' + encodeURIComponent('Bonjour NG-Shop, j\'aimerais avoir des informations.');

export default function Produit({ st, go, addToCart }) {
  const current = PRODUCTS.find((p) => p.id === st.pid) || PRODUCTS[0];
  const { percent, oldPrice } = discountOf(current);

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
    </section>
  );
}
