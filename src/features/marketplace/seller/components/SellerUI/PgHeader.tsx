interface PageHeaderProps {
  title: string;
  description: string;
  icon?: string;
  className?: string;
}

export default function PageHeader({ title, description, icon, className = "" }: PageHeaderProps) {
  return (
    <div className={`w-full flex flex-col gap-2 pb-6 ${className}`}>

      {/* Title + Icon */}
      <div className="flex items-center gap-3 flex-wrap">
    {icon && (
  <img 
    src={icon}
    alt="icon"
    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
  />
)}

        <h1 className="
          font-[poppins] font-semibold text-[30px] sm:text-[30px] md:text-[30px]
          text-black leading-tight
        ">
          {title}
        </h1>
      </div>

      {/* Description */}
      <p className="
         font-['open_sans'] text-[13px] sm:text-[14px] md:text-[15px]
        text-[#707C8B] leading-[1.4]
        max-w-[750px]
      ">
        {description}
      </p>

<div className="w-full h-[2px] bg-gradient-to-r from-[#008282] to-[#FFFFFF] mt-2"></div>
    </div>
  );
}
