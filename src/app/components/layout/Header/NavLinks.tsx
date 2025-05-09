import Link from "next/link";
import Button from "../../ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { name: "Why", href: "/" },
  { name: "What", href: "/" },
  { name: "About", href: "/" },
];

export default function NavLinks({ className }: { className?: string }) {
  return (
    <nav 
      aria-label="Main navigation" 
      className={cn("flex items-center gap-8", className)}
    >
      <ul className="flex space-x-8">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-gray-700 hover:text-primary-600 transition-colors"
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