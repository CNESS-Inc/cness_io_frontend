// src/app/components/layout/Header/NavLinks.tsx
import Link from "next/link";
import Button from "../../../../components/ui/Button";

const links = [
  { name: "Why", href: "/" },
  { name: "What", href: "/" },
  { name: "About", href: "/" },
];

export default function NavLinks() {
  return (
    <nav aria-label="Main navigation" className="flex items-center gap-8">
      <ul className="hidden md:flex space-x-8">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-gray-700 hover:text-primary-600 transition-colors"
              aria-current={
                typeof window !== "undefined" &&
                window.location.pathname === link.href
                  ? "page"
                  : undefined
              }
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        className="bg-[#7077FE] hover:bg-transparent py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
        variant="primary"
        withGradientOverlay
      >
        Sign Up
      </Button>
    </nav>
  );
}
