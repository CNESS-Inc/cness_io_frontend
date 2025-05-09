// components/ui/Card.tsx
//@ts-ignore
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={`rounded-lg shadow-md bg-white ${className}`}>{children}</div>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
