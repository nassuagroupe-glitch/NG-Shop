export default function Stars({ value, size }) {
  const rounded = Math.round(value);
  return (
    <span className="rating-stars" style={size ? { fontSize: size } : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}>{rounded >= n ? '★' : '☆'}</span>
      ))}
    </span>
  );
}
