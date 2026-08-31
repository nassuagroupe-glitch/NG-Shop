const ITEMS = [
  { icon: '🚚', title: 'Livraison 48 h', sub: 'Abidjan & toute la Côte d\'Ivoire' },
  { icon: '🛠️', title: 'Garantie atelier 12 mois', sub: 'Sur tout le matériel vendu' },
  { icon: '✅', title: 'Paiement sécurisé', sub: 'Mobile money · CB · espèces' },
  { icon: '📞', title: 'Service technicien local', sub: '+225 07 08 91 23 45' }
];

export default function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-strip-inner">
        {ITEMS.map((it) => (
          <div className="trust-item" key={it.title}>
            <span className="trust-icon">{it.icon}</span>
            <div>
              <div className="trust-title">{it.title}</div>
              <div className="trust-sub">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
