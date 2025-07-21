import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";

interface LottieOnViewProps {
  animationData: object;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LottieOnView: React.FC<LottieOnViewProps> = ({
  animationData,
  loop = true,
  className,
  style,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
    rootMargin: '0px 0px -20px 0px'
  });

  useEffect(() => {
    if (lottieRef.current) {
      if (inView) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [inView]);

  return (
    <div ref={ref} className={className} style={style}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={false}
      />
    </div>
  );
};

export default LottieOnView; 