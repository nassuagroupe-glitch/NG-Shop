import { fmt } from '../data.js';

const ROLES = ['Client', 'Technicien', 'Gérant'];

export default function Header({ st, setQ, go, setRole, cartCount, cartAmount }) {
  const submitSearch = (e) => {
    e.preventDefault();
    go('boutique');
  };

  return (
    <header className="header">
      <button
        className="brand"
        onClick={() => go('boutique')}
        style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}
      >
        <img className="brand-badge" src="/brand/nassua-logo.png" alt="Nassua Tech Groupe" />
        <div style={{ textAlign: 'left' }}>
          <div className="brand-word">NG<span>-</span>Shop</div>
          <div className="brand-tagline">Vente &amp; maintenance</div>
        </div>
      </button>

      <form className="header-search" onSubmit={submitSearch}>
        <span className="header-search-icon" aria-hidden="true">🔍</span>
        <input
          className="input"
          placeholder="Rechercher un produit ou une référence…"
          value={st.q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn btn-primary header-search-btn">Rechercher</button>
      </form>

      <div className="header-right">
        <div className="role-switch">
          {ROLES.map((r) => (
            <button key={r} className={st.role === r ? 'active' : ''} onClick={() => setRole(r)}>
              {r}
            </button>
          ))}
        </div>
        <button className="cart-pill" onClick={() => go('panier')}>
          🛒
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          <span className="cart-total">{fmt(cartAmount)}</span>
        </button>
      </div>
    </header>
  );
}
