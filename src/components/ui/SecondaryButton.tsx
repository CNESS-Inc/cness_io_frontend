// src/components/SecondaryButton.tsx
import type { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export default function SecondaryButton({ children, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="
          flex w-[126px] py-2 px-6 justify-center items-center gap-[7px]
          rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF]
          text-white text-center font-['Plus Jakarta Sans'] text-[12px] font-medium leading-normal
          whitespace-nowrap cursor-pointer
        "
      >
        {children}
      </button>
    );
  }
  