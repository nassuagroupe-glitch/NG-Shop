import { useEffect, useState } from 'react';

export default function TileLogoSlides({ images, interval = 2600 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="tile-logo-slot">
      {images.map((src, i) => (
        <img key={src} src={src} alt="" style={{ opacity: i === index ? 1 : 0 }} />
      ))}
    </div>
  );
}
