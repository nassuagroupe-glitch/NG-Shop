import { SERVICES, INTER_TYPES, SLOTS, fmt } from '../data.js';

export default function Maintenance({ st, setInter, setSlot, sendRequest, go }) {
  return (
    <section>
      <div style={{ maxWidth: 560, marginBottom: 28 }}>
        <h1 style={{ marginBottom: 10 }}>Demander un dépannage</h1>
        <p style={{ opacity: 0.75 }}>
          Décrivez la panne, choisissez à distance ou sur site. Un technicien confirme le créneau sous deux heures ouvrées.
        </p>
      </div>
      <div className="split-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,0.85fr)', gap: 44, alignItems: 'start', maxWidth: 960 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Type d'intervention</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {INTER_TYPES.map((t) => (
                <button key={t} className={'chip' + (st.inter === t ? ' active' : '')} onClick={() => setInter(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="eq">Équipement concerné</label>
            <input id="eq" className="input" placeholder="ex. Dell OptiPlex 7010 — poste comptabilité" />
          </div>
          <div className="field">
            <label htmlFor="pb">Symptômes</label>
            <textarea id="pb" className="input" placeholder="Le poste s'éteint après 10 minutes, ventilateur bruyant depuis lundi." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Créneau souhaité</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SLOTS.map((s) => (
                <button key={s} className={'chip' + (st.slot === s ? ' active' : '')} onClick={() => setSlot(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={sendRequest}>Envoyer la demande</button>
            <span style={{ fontSize: 12, opacity: 0.6 }}>Déplacement Abidjan inclus · hors pièces</span>
          </div>
          {st.requestSent && (
            <div className="notice">
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 4 }}>Demande reçue — ticket NG-M-2481</div>
              <div style={{ fontSize: 13 }}>
                Intervention {st.inter.toLowerCase()} — créneau {st.slot.toLowerCase()}. Un technicien confirme par SMS au +225 07 08 91 23 45.
              </div>
              <button className="btn btn-ghost" onClick={() => go('suivi')} style={{ marginTop: 6, paddingLeft: 0 }}>Suivre la réparation →</button>
            </div>
          )}
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <h5 style={{ marginBottom: 10 }}>Tarifs de référence</h5>
            <table className="table">
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.name}><td>{s.name}</td><td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(s.price)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h5 style={{ marginBottom: 6 }}>Contrat PME</h5>
            <p style={{ fontSize: 13, opacity: 0.72 }}>
              Jusqu'à 15 postes, supervision à distance, deux passages mensuels et priorité d'intervention sous 4 h.
              Facturé mensuellement, résiliable à 30 jours.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
