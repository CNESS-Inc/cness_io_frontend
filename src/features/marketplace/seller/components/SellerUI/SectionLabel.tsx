interface SectionTitleProps {
  title: string;
  description: string;
  icon?: string;
  className?: string;
}

export default function SectionLabel({ title, description, icon, className = "" }: SectionTitleProps) {
  return (
    <div className={`w-full px-[20px] flex flex-col gap-2 ${className}`}>

      {/* Icon + Title */}
      <div className="flex items-center gap-3 flex-wrap">
        {icon && (
  <img 
    src={icon}
    alt="icon"
    className="w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5   object-contain"
  />
)}

        <h2 className="
          font-[poppins] font-semibold 
          text-[20px] sm:text-[20px] md:text-[20px]
          text-black leading-tight
        ">
          {title}
        </h2>
      </div>

      {/* Description */}
      <p className="
       font-['open_sans'] text-[13px] sm:text-[13px] md:text-[13px]
        text-[#707c8b] leading-[1.45] max-w-[750px]
      ">
        {description}
      </p>

    </div>
  );
}
