import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const links = [
  { name: "Why", href: "/why" },
  { name: "About", href: "/about" },
];

export default function Navigationlinks({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn("flex items-center gap-8", className)}
    >
      <ul className="flex space-x-8">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.href}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
