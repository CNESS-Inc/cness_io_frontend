import React, { useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string;
  priority?: boolean;
}

const Image: React.FC<LazyImageProps> = ({
  src,
  placeholderSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg==",
  alt = "",
  className = "",
  width,
  height,
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(priority); // If priority, start with loaded state

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            src === "/cnesslogo.png" ? "" : "rounded-0"
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/profile.png";
          }}
          style={{ width, height }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-300 ${
          src === "/cnesslogo.png" ? "" : "rounded-0"
        } ${isLoaded ? "opacity-100" : "opacity-0"}`}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
};

export default Image;
