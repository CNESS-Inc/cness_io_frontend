import React, { useState } from 'react'

interface OptimizeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string // required full path with extension
  placeholderSrc?: string
  fallbackSrc?: string
  priority?: boolean
  aspectRatio?: string // e.g., "16/9", "1/1"
}

const OptimizeImage: React.FC<OptimizeImageProps> = ({
  src,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg==',
  fallbackSrc = '/fallback.jpg',
  alt = '',
  className = '',
  width,
  height,
  priority = false,
  aspectRatio = '16/9',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(priority)

  // Extract filename & extension
  const pathParts = src.split('/')
  const fileName = pathParts.pop() || ''
  const extMatch = fileName.match(/\.(\w+)$/)
  const ext = extMatch?.[1].toLowerCase() || 'png'
  const baseName = fileName.replace(/\.[^/.]+$/, '')

  // Construct possible image paths
  const webpPath = `/webp/${baseName}.webp`
  const pngPath = `/png/${baseName}.png`
  const originalPath = src
  const finalFallback = fallbackSrc

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio,
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      {/* Placeholder Blur Layer */}
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 blur-sm"
        />
      )}

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
            const target = e.currentTarget
            if (target.src !== finalFallback) {
              target.src = finalFallback
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
    </div>
  )
}

export default OptimizeImage
