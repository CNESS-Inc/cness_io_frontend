import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  effect?: 'fade-up' | 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function LazySection({ 
  children, 
  effect = 'fade-up', 
  delay = 0, 
  duration = 0.7,
  threshold = 0.2,
  className = ''
}: LazySectionProps) {
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold,
    rootMargin: '0px 0px -50px 0px'
  });

  const getVariants = () => {
    const baseTransition = { duration, delay };
    
    switch (effect) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        };
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: 60 },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: -60 },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1, transition: baseTransition }
        };
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        };
    }
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={getVariants()}
      style={{ willChange: 'opacity, transform' }}
      className={className}
    >
      {children}
    </motion.section>
  );
} 