import { useEffect, useRef, useState } from "react";

interface LazyZohoFormProps {
  url: string;
  title: string;
  minHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LazyZohoForm = ({
  url,
  title,
  minHeight = 750,
  className,
  style,
}: LazyZohoFormProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // stop observing once visible
        }
      },
      { rootMargin: "200px 0px" } // load 200px before viewport
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight, ...style }}
    >
      {isVisible && (
        <iframe
          src={url}
          className="w-full h-full border-0 rounded-lg"
          style={{ minHeight, height: "100%", overflow: "auto" }}
          scrolling="auto"
          title={title}
        />
      )}
    </div>
  );
};

export default LazyZohoForm;
