import type { ReactNode, MouseEventHandler } from "react";
interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }
export default function PrimaryButton({ children, onClick }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="
          flex py-2 px-6 justify-center items-center gap-[7px]
  rounded-full bg-[#7077FE]
  text-white text-center font-['Plus Jakarta Sans'] text-[12px] font-medium leading-normal
  whitespace-nowrap cursor-pointer
        "
      >
        {children}
      </button>
    );
  }
  