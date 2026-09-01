import { useEffect, useState } from 'react';
import { PRODUCTS } from './data.js';

const STORAGE_KEY = 'ng-shop-state-v1';

const DEFAULT_STATE = {
  screen: 'boutique', role: 'Client', cat: 'Tous', q: '', pid: 'p1',
  cart: { p1: 1, p4: 2 }, pay: 'Orange Money', step: 2,
  inter: 'Sur site', slot: 'Jeudi matin', requestSent: false,
  posLines: [{ code: 'NGS-3301', qty: 1 }, { code: 'NGS-3318', qty: 2 }], scan: '', cashDone: false
};

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const saved = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...saved };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useShop() {
  const [st, setSt] = useState(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
    } catch {
      // stockage indisponible (navigation privée, quota) — l'app reste utilisable en mémoire
    }
  }, [st]);

  const patch = (p) => setSt((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));

  return {
    st,
    go: (screen) => patch({ screen }),

    setRole: (role) => patch({
      role,
      screen: role === 'Gérant' ? 'dashboard' : role === 'Technicien' ? 'suivi' : 'boutique'
    }),
    setCat: (cat) => patch({ cat }),
    setQ: (q) => patch({ q }),
    openProduct: (pid) => patch({ screen: 'produit', pid }),
    addToCart: (id) => patch((s) => ({
      cart: { ...s.cart, [id]: (s.cart[id] || 0) + 1 }
    })),
    incCart: (id) => patch((s) => ({ cart: { ...s.cart, [id]: s.cart[id] + 1 } })),
    decCart: (id) => patch((s) => {
      const c = { ...s.cart };
      if (c[id] > 1) c[id] -= 1; else delete c[id];
      return { cart: c };
    }),
    removeCart: (id) => patch((s) => {
      const c = { ...s.cart };
      delete c[id];
      return { cart: c };
    }),
    setPay: (pay) => patch({ pay }),
    clearCart: () => patch({ cart: {} }),

    setInter: (inter) => patch({ inter, requestSent: false }),
    setSlot: (slot) => patch({ slot, requestSent: false }),
    sendRequest: () => patch({ requestSent: true }),

    advanceStep: () => patch((s) => ({ step: Math.min(4, s.step + 1) })),

    setScan: (scan) => patch({ scan }),
    addCode: (code) => patch((s) => {
      const p = PRODUCTS.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
      if (!p) return {};
      const lines = s.posLines.slice();
      const i = lines.findIndex((l) => l.code === p.code);
      if (i >= 0) lines[i] = { code: p.code, qty: lines[i].qty + 1 };
      else lines.push({ code: p.code, qty: 1 });
      return { posLines: lines, scan: '', cashDone: false };
    }),
    cashOut: () => patch({ cashDone: true }),
    clearPos: () => patch({ posLines: [], cashDone: false })
  };
}
