
import { Link } from 'react-router-dom';

const Fcopyright = () => {
  return (
    <footer className="mt-auto">
      <div className="py-4 bg-[#C6C4FF] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xs md:text-sm">Copyright © {new Date().getFullYear()}</div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
             <Link to="/terms-and-conditions" className="text-xs md:text-sm hover:underline">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="text-xs md:text-sm hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Fcopyright;
