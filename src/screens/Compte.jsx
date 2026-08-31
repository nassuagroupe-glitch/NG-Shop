import { HISTORY, PARC, ACCOUNT_USERS } from '../data.js';

export default function Compte() {
  return (
    <section>
      <h1 style={{ marginBottom: 6 }}>Cabinet Koffi &amp; Fils</h1>
      <div style={{ opacity: 0.65, fontSize: 14, marginBottom: 34 }}>
        Compte entreprise · Abidjan, Cocody · contact Estelle Koffi · paiement à 15 jours
      </div>
      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 44, alignItems: 'start' }}>
        <div>
          <h5 style={{ marginBottom: 12 }}>Commandes &amp; factures</h5>
          <table className="table">
            <thead><tr><th>Pièce</th><th>Date</th><th>Statut</th><th style={{ textAlign: 'right' }}>Montant</th><th /></tr></thead>
            <tbody>
              {HISTORY.map((h) => (
                <tr key={h.ref}>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{h.ref}</td>
                  <td>{h.date}</td>
                  <td><span className={'tone-' + (h.status === 'Payée' ? 'ok' : 'danger')} style={{ fontSize: 12 }}>{h.status}</span></td>
                  <td style={{ textAlign: 'right' }}>{h.amount}</td>
                  <td style={{ textAlign: 'right' }}><button className="btn btn-ghost" onClick={() => window.print()}>PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 36 }}>
            <h5 style={{ marginBottom: 12 }}>Parc équipé &amp; tickets</h5>
            {PARC.map((p) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline', paddingBottom: 12 }}>
                <div>
                  <div className="mini-heading">{p.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.55 }}>{p.detail}</div>
                </div>
                <span className={'tone-' + (p.ok ? 'ok' : 'danger')} style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <h5 style={{ marginBottom: 10 }}>Utilisateurs du compte</h5>
            {ACCOUNT_USERS.map((u) => (
              <div key={u.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBottom: 8, fontSize: 14 }}>
                <span>{u.name}</span>
                <span style={{ opacity: 0.6, fontSize: 12 }}>{u.role}</span>
              </div>
            ))}
            <button className="btn btn-secondary" style={{ marginTop: 8 }}>Inviter un utilisateur</button>
          </div>
          <div>
            <h5 style={{ marginBottom: 6 }}>Installation</h5>
            <p style={{ fontSize: 13, opacity: 0.72 }}>
              NG-Shop s'installe sur Windows (poste caisse et atelier) et sur Android (tablette vendeur).
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary">Windows (.exe)</button>
              <button className="btn btn-secondary">Android (.apk)</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
