import { PRODUCTS, SERVICES, CATEGORY_ICONS, fmt, discountOf } from '../data.js';
import HeroCarousel from '../components/HeroCarousel.jsx';
import TileLogoSlides from '../components/TileLogoSlides.jsx';

const PME_LOGOS = ['/pme/office365.png', '/pme/windows.png', '/pme/windev.png'];
const REPAIR_IMAGES = ['/repair/repair1.png', '/repair/repair2.svg', '/repair/repair3.jpg'];

export default function Boutique({ st, setCat, setQ, openProduct, addToCart, go }) {
  const catNames = [...new Set(PRODUCTS.map((p) => p.cat))];
  const q = st.q.trim().toLowerCase();
  const isBrowsing = st.cat === 'Tous' && !q;
  const filtered = PRODUCTS.filter(
    (p) =>
      (st.cat === 'Tous' || p.cat === st.cat) &&
      (!q || (p.name + ' ' + p.code + ' ' + p.cat).toLowerCase().includes(q))
  );

  return (
    <section>
      <div className="maintenance-row">
        <h2 className="maintenance-title">Services de maintenance</h2>
        <div className="maintenance-cards">
          {SERVICES.map((s) => (
            <div className="card maintenance-card" key={s.name}>
              <div className="card-kicker">Maintenance</div>
              <h4 className="maintenance-card-title">{s.name}</h4>
              <p className="maintenance-card-desc">{s.desc}</p>
              <div className="maintenance-card-price">{fmt(s.price)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero">
        <HeroCarousel>
          <div className="hero-kicker">
            NG-Shop · Abidjan, Côte d'Ivoire
          </div>
          <h1>Le matériel qui fait tourner votre bureau, et la main qui le répare.</h1>
          <p>PC portables et bureaux, composants, imprimantes, réseaux. Maintenance à distance ou sur site, garantie atelier 12 mois.</p>
          <div>
            <button className="btn btn-primary btn-pill" onClick={() => setCat('Tous')}>Voir le catalogue</button>
          </div>
        </HeroCarousel>
        <div className="hero-side">
          <button className="hero-tile hero-tile-a" onClick={() => go('maintenance')}>
            <TileLogoSlides images={REPAIR_IMAGES} />
            <h3>Dépannage à domicile</h3>
            <span>Un technicien confirme le créneau sous 2 h</span>
          </button>
          <button className="hero-tile hero-tile-b" onClick={() => go('maintenance')}>
            <TileLogoSlides images={PME_LOGOS} />
            <h3>Vente et Installation de Logiciels &amp; Apps</h3>
            <span>Windows, Office 365 et logiciels métier installés sur site</span>
          </button>
        </div>
      </div>

      <div className="section-title">
        <h2>Nos catégories</h2>
      </div>
      <div className="cat-rail">
        <button className={'cat-item' + (st.cat === 'Tous' ? ' active' : '')} onClick={() => setCat('Tous')}>
          <span className="cat-circle">🗂️</span>
          <span className="cat-item-label">Tous</span>
          <span className="cat-item-count">{PRODUCTS.length} produits</span>
        </button>
        {catNames.map((c) => (
          <button key={c} className={'cat-item' + (st.cat === c ? ' active' : '')} onClick={() => setCat(c)}>
            <span className="cat-circle">{CATEGORY_ICONS[c] || '🧰'}</span>
            <span className="cat-item-label">{c}</span>
            <span className="cat-item-count">{PRODUCTS.filter((p) => p.cat === c).length} produits</span>
          </button>
        ))}
      </div>

      <div className="field" style={{ maxWidth: 420, marginBottom: 10 }}>
        <label htmlFor="q">Rechercher un produit ou une référence</label>
        <input
          id="q"
          className="input"
          placeholder="ex. SSD 1 To, NGS-3301"
          value={st.q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isBrowsing ? (
        catNames.map((c) => (
          <CategoryRail
            key={c}
            title={c}
            products={PRODUCTS.filter((p) => p.cat === c)}
            onSeeMore={() => setCat(c)}
            openProduct={openProduct}
            addToCart={addToCart}
          />
        ))
      ) : (
        <>
          <div className="section-title">
            <h2>Au catalogue</h2>
            <span className="text-muted" style={{ fontSize: 13 }}>{filtered.length} références disponibles</span>
          </div>
          <div className="product-grid" style={{ marginBottom: 20 }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} openProduct={openProduct} addToCart={addToCart} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function CategoryRail({ title, products, onSeeMore, openProduct, addToCart }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="section-title">
        <h2>{title}</h2>
        <button className="see-more-link" onClick={onSeeMore}>Voir plus →</button>
      </div>
      <div className="product-rail">
        {products.map((p) => (
          <div className="product-rail-item" key={p.id}>
            <ProductCard p={p} openProduct={openProduct} addToCart={addToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ p, openProduct, addToCart }) {
  const lowStock = p.stock <= 4;
  const { percent, oldPrice } = discountOf(p);
  return (
    <article className="card product-card">
      {lowStock ? (
        <span className="tag tag-badge product-badge">{p.stock === 0 ? 'Rupture' : 'Stock faible'}</span>
      ) : (
        <span className="discount-badge">-{percent}%</span>
      )}
      <div className="photo">{p.image ? <img src={p.image} alt={p.name} /> : p.name}</div>
      <div className="card-kicker">{p.cat}</div>
      <button className="product-name-btn" onClick={() => openProduct(p.id)}>
        {p.name}
      </button>
      <div className="card-meta">réf. {p.code}</div>
      <div className="product-price-row">
        <span className="price-group">
          <span className="product-price">{fmt(p.price)}</span>
          <span className="product-oldprice">{fmt(oldPrice)}</span>
        </span>
        <StockInline p={p} />
      </div>
      <button className="btn btn-primary btn-block" onClick={() => addToCart(p.id)}>Ajouter</button>
    </article>
  );
}

export function StockTag({ p }) {
  const danger = p.stock <= 4;
  return <span className={'stock-tag tone-' + (danger ? 'danger' : 'ok')}>{p.stock === 0 ? 'Rupture' : p.stock + ' en stock'}</span>;
}

export function StockInline({ p }) {
  const danger = p.stock <= 4;
  return <span className={'stock-inline tone-' + (danger ? 'danger' : 'ok')}>{p.stock === 0 ? 'Rupture' : p.stock + ' en stock'}</span>;
}
