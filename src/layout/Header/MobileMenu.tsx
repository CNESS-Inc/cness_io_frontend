// src/app/components/layout/Header/MobileMenu.tsx

import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const links = [
  { name: "Why", href: "/" },
  { name: "What", href: "/" },
  { name: "About", href: "/" },
];

export default function MobileMenu({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`md:hidden bg-white transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
      }`}
    >
      <nav aria-label="Mobile navigation" className="px-4">
        <ul className="flex flex-col space-y-4">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="block text-gray-700 hover:text-primary-600 transition-colors py-2 px-4"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Button
              className="w-full bg-[#7077FE] hover:bg-transparent py-3 px-6 rounded-full transition-colors duration-500 ease-in-out"
              variant="primary"
              withGradientOverlay
            >
              Sign Up
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}