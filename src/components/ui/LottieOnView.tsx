import Lottie from "lottie-react";

interface LottieOnViewProps {
 animationData: object | null;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LottieOnView = ({ animationData, ...props }: LottieOnViewProps) => {
  if (!animationData) return null;

  return (
    <Lottie animationData={animationData} {...props} />
  );
};

export default LottieOnView; 