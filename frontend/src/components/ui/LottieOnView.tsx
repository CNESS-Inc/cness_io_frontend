import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";

interface LottieOnViewProps {
  // animationData: object | null;
  src: string;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LottieOnView = ({
  src,
  loop = true,
  className,
  style,
}: // { animationData, ...props }
LottieOnViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // stop observing once visible
        }
      },
      { rootMargin: "200px" } // preload slightly before visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || animationData) return;

    fetch(src)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("LottieOnView: Failed to load JSON", err));
  }, [isVisible, src, animationData]);

  // if (!animationData) return null;

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible && animationData && (
        <Lottie animationData={animationData} loop={loop} />
      )}
    </div>

    //   <Lottie animationData={animationData} {...props} />
  );
};

export default LottieOnView;
