import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SmartFloatingFAQButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show/hide based on page changes and user activity
  useEffect(() => {
    // Always show briefly when page loads
    setIsVisible(true);
    const timer = setTimeout(() => {
      if (!isHovered) setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname, isHovered]);

  // Show when user moves mouse to bottom right corner
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const fromBottom = window.innerHeight - e.clientY;
      const fromRight = window.innerWidth - e.clientX;
      
      if (fromBottom < 100 && fromRight < 100) {
        setIsVisible(true);
      } else if (!isHovered) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  // Show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (lastScrollY > window.scrollY) {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => navigate('/dashboard/support')}
      onMouseEnter={() => {
        setIsVisible(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:from-indigo-700 hover:to-purple-700
        text-white font-semibold
        flex items-center justify-center
        w-14 h-14 md:w-auto md:px-6 md:py-3
        rounded-full shadow-xl
        transition-all duration-500 ease-in-out
        z-50
        ${isVisible ? 
          'opacity-100 translate-y-0 translate-x-0' : 
          'opacity-0 translate-y-4 translate-x-4'
        }
        transform-gpu
        hover:shadow-2xl
        hover:scale-105
      `}
      aria-label="Frequently Asked Questions"
    >
      <span className="hidden md:inline">FAQ</span>
      <span className="md:hidden text-xl font-bold">?</span>
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500"></span>
      </span>
    </button>
  );
};

export default SmartFloatingFAQButton;