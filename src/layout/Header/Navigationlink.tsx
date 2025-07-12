import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const links = [
  { name: "About", href: "/about" },
  { name: "Sign Up", href: "/signup" },
  { name: "Login", href: "/login" }
];

export default function Navigationlinks({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn("flex items-center gap-8", className)}
    >
      <ul className="flex space-x-8 items-center">
        {links.map((link) => {
          let linkClass = "transition-colors";

          if (link.name === "About") {
            linkClass += " text-gray-700 hover:text-primary-600";
          } else if (link.name === "Sign Up") {
            linkClass +=
              " bg-white text-[#64748B] px-4 py-2 rounded-[50px] shadow-[0_0px_5px_rgba(0,0,0,0.16)] w-[105px] inline-block text-center";
          } else if (link.name === "Login") {
            linkClass +=
              " bg-linear-to-r from-[#7077FE] to-[#9747FF] text-white px-4 py-2 rounded-[50px] shadow-[0_0px_5px_rgba(0,0,0,0.16)] w-[105px] inline-block text-center";
          }

          return (
            <li key={link.name}>
              <Link to={link.href.trim()} className={linkClass}>
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
