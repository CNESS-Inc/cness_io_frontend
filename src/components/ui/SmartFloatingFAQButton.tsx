import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SmartFloatingFAQButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on support page
  if (location.pathname === '/dashboard/support') return null;

  return (
    <button
      onClick={() => navigate('/dashboard/support')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:from-indigo-700 hover:to-purple-700
        text-white font-semibold
        flex items-center justify-center
        w-14 h-14 md:w-auto md:px-6 md:py-3
        rounded-full shadow-xl
        transition-all duration-300 ease-in-out
        z-50
        opacity-100
        transform-gpu
        hover:shadow-2xl
        hover:scale-105
      `}
      aria-label="Provide Feedback"
    >
      <span className="hidden md:inline">Provide Your Feedback</span>
      <span className="md:hidden text-xl font-bold">?</span>
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500"></span>
      </span>
    </button>
  );
};
 
export default SmartFloatingFAQButton;