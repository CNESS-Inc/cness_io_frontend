import React, { useState, useEffect, useRef } from 'react';

interface OptimizeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholderSrc?: string;
  fallbackSrc?: string;
  priority?: boolean;
  aspectRatio?: string; // "16/9"
}

const OptimizeImage: React.FC<OptimizeImageProps> = ({
  src,
  placeholderSrc = 'data:image/svg+xml;base64,...',
  fallbackSrc = '/fallback.jpg',
  alt = '',
  className = '',
  width,
  height,
  priority = false,
  aspectRatio = '16/9',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [inView, setInView] = useState(priority);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (priority) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [priority]);

  // Extract filename parts
  const pathParts = src.split('/');
  const fileName = pathParts.pop() || '';
  const extMatch = fileName.match(/\.(\w+)$/);
  const ext = extMatch?.[1].toLowerCase() || 'png';
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  const webpPath = `/webp/${baseName}.webp`;
  const pngPath = `/png/${baseName}.png`;
  const originalPath = src;
  const finalFallback = fallbackSrc;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio,
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 blur-sm"
        />
      )}

      {inView && (
        <picture>
          <source srcSet={webpPath} type="image/webp" />
          <source srcSet={pngPath} type="image/png" />
          <source srcSet={originalPath} type={`image/${ext === 'jpg' ? 'jpeg' : ext}`} />
          <img
            src={originalPath}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              if (e.currentTarget.src !== finalFallback) {
                e.currentTarget.src = finalFallback;
              }
            }}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            width={width}
            height={height}
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizeImage;
