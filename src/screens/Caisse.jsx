import { PRODUCTS, PAYMENTS, fmt } from '../data.js';

const QUICK_CODES = ['NGS-3301', 'NGS-3318', 'NGS-5203', 'NGS-4102'];

export default function Caisse({ st, setScan, addCode, setPay, cashOut, clearPos }) {
  const posLines = st.posLines.map((l) => {
    const p = PRODUCTS.find((x) => x.code === l.code);
    return { ...l, p };
  });
  const posTotal = posLines.reduce((a, l) => a + l.p.price * l.qty, 0);

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <h1 style={{ margin: 0 }}>Caisse — boutique Plateau</h1>
        <span className="tag tag-neutral">Poste 1 · {st.role}</span>
      </div>
      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
        <div>
          <div className="field" style={{ maxWidth: 420, marginBottom: 8 }}>
            <label htmlFor="scan">Scanner ou saisir une référence</label>
            <input
              id="scan"
              className="input"
              placeholder="NGS-…"
              value={st.scan}
              onChange={(e) => setScan(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addCode(e.target.value); }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
            <span style={{ fontSize: 12, opacity: 0.55, alignSelf: 'center' }}>Codes fréquents</span>
            {QUICK_CODES.map((c) => (
              <button key={c} className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => addCode(c)}>{c}</button>
            ))}
          </div>
          <table className="table">
            <thead><tr><th>Article scanné</th><th style={{ width: 70 }}>Qté</th><th style={{ textAlign: 'right' }}>Montant</th></tr></thead>
            <tbody>
              {posLines.map((l) => (
                <tr key={l.code}>
                  <td><span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{l.p.name}</span> <span style={{ fontSize: 12, opacity: 0.5 }}>{l.p.code}</span></td>
                  <td>{l.qty}</td>
                  <td style={{ textAlign: 'right' }}>{fmt(l.p.price * l.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {posLines.length === 0 && (
            <p style={{ opacity: 0.6, fontSize: 13, marginTop: 14 }}>Aucun article. Scannez un code-barres ou touchez une référence fréquente.</p>
          )}
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="pos-total">
            {posTotal.toLocaleString('fr-FR').replace(/[  ]/g, ' ')}
          </div>
          <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55 }}>Total à encaisser · FCFA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {PAYMENTS.map((m) => (
              <button key={m.id} className={'choice-row' + (st.pay === m.id ? ' active' : '')} onClick={() => setPay(m.id)}>
                <span className="choice-dot" />
                <span style={{ flex: 1, textAlign: 'left' }}>{m.id}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-block" onClick={cashOut} disabled={posLines.length === 0}>Encaisser &amp; imprimer le ticket</button>
          <button className="btn btn-secondary btn-block" onClick={clearPos}>Annuler la vente</button>
          {st.cashDone && (
            <div className="notice">Vente enregistrée — ticket imprimé.</div>
          )}
        </aside>
      </div>
    </section>
  );
}
