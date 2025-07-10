// src/components/SecondaryButton.tsx
export default function SecondaryButton({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        className="
          flex w-[126px] py-2 px-6 justify-center items-center gap-[7px]
          rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF]
          text-white text-center font-['Plus Jakarta Sans'] text-[12px] font-medium leading-normal
          whitespace-nowrap
        "
      >
        {children}
      </button>
    );
  }
  