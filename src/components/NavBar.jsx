import { NAV } from '../data.js';

export default function NavBar({ st, go, cartCount }) {
  const navItems = NAV.filter((n) => n.roles.includes(st.role));

  return (
    <nav className="navbar">
      <div className="navbar-list">
        {navItems.map((item) => {
          const active = st.screen === item.id || (item.id === 'boutique' && st.screen === 'produit');
          return (
            <button
              key={item.id}
              className={'navbar-item' + (active ? ' active' : '')}
              onClick={() => go(item.id)}
            >
              {item.label}
              {item.id === 'panier' && cartCount > 0 && <span className="tag tag-accent">{cartCount}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
