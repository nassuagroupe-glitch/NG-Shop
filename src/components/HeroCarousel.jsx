import { useEffect, useState } from 'react';

const SLIDES = ['/hero/slide-1.jpg', '/hero/slide-2.jpg', '/hero/slide-3.jpg', '/hero/slide-4.jpg'];

export default function HeroCarousel({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-main">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="hero-slide"
          style={{ backgroundImage: `url(${src})`, opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="hero-overlay" />
      <div className="hero-content">{children}</div>
      <div className="hero-dots">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            className={'hero-dot' + (i === index ? ' active' : '')}
            aria-label={`Diapositive ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
