import { useShop } from './useShop.js';
import { cartTotal } from './data.js';
import TopBar from './components/TopBar.jsx';
import Header from './components/Header.jsx';
import NavBar from './components/NavBar.jsx';
import TrustStrip from './components/TrustStrip.jsx';
import Boutique from './screens/Boutique.jsx';
import Produit from './screens/Produit.jsx';
import Panier from './screens/Panier.jsx';
import Maintenance from './screens/Maintenance.jsx';
import Suivi from './screens/Suivi.jsx';
import Caisse from './screens/Caisse.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Compte from './screens/Compte.jsx';

export default function App() {
  const shop = useShop();
  const { st } = shop;
  const cartCount = Object.values(st.cart).reduce((a, b) => a + b, 0);

  return (
    <div className="app-shell">
      <TopBar />
      <Header st={st} setQ={shop.setQ} go={shop.go} setRole={shop.setRole} cartCount={cartCount} cartAmount={cartTotal(st.cart)} />
      <NavBar st={st} go={shop.go} cartCount={cartCount} />
      <main className="screen">
        {st.screen === 'boutique' && (
          <Boutique st={st} setCat={shop.setCat} setQ={shop.setQ} openProduct={shop.openProduct} addToCart={shop.addToCart} go={shop.go} />
        )}
        {st.screen === 'produit' && <Produit st={st} go={shop.go} addToCart={shop.addToCart} />}
        {st.screen === 'panier' && (
          <Panier st={st} go={shop.go} incCart={shop.incCart} decCart={shop.decCart} removeCart={shop.removeCart} setPay={shop.setPay} checkout={shop.checkout} />
        )}
        {st.screen === 'maintenance' && (
          <Maintenance st={st} setInter={shop.setInter} setSlot={shop.setSlot} sendRequest={shop.sendRequest} go={shop.go} />
        )}
        {st.screen === 'suivi' && <Suivi st={st} advanceStep={shop.advanceStep} />}
        {st.screen === 'caisse' && (
          <Caisse st={st} setScan={shop.setScan} addCode={shop.addCode} setPay={shop.setPay} cashOut={shop.cashOut} clearPos={shop.clearPos} />
        )}
        {st.screen === 'dashboard' && <Dashboard />}
        {st.screen === 'compte' && <Compte />}
      </main>
      <TrustStrip />
    </div>
  );
}
