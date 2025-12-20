type NameVariant = "maria" | "sandy" | "john" | "patrick";

const pillStyles: Record<NameVariant, string> = {
  maria: "bg-gradient-to-r from-[#D479D7] to-[#483EC5]",
  sandy: "bg-gradient-to-r from-[#4540CF] to-[#8176D3]",
  john: "bg-gradient-to-r from-[#D479D7] to-[#483EC5]",
  patrick: "bg-[#3F47F4]",
};

function NamePill({
  name,
  variant,
}: {
  name: string;
  variant: NameVariant;
}) {
  return (
    <span
      className={`
        inline-flex items-center
        h-[20px]
        px-[10px] py-[4px]
        rounded-[30px]
        text-[10px] font-medium
        font-['Poppins']
        text-white
        whitespace-nowrap
        ${pillStyles[variant]}
      `}
    >
      {name}
    </span>
  );
}

export default function RecommendationCard() {
  return (
    <div className="w-full h-[266px] bg-[#f1f3ff] rounded-[15px] p-[20px] flex flex-col justify-between">
      
      {/* ===== TOP AREA ===== */}
<div className="relative flex flex-col items-center gap-[12px] pt-[50px] pb-[5px]">
        {/* Top name pills */}
       <div className="absolute top-[20px] left-0 right-0 flex justify-between px-[40px]">
  <div className="-translate-y-[6px]">
    <NamePill name="Maria" variant="maria" />
  </div>

  <div className="translate-y-[6px]">
    <NamePill name="Sandy" variant="sandy" />
  </div>
</div>


        {/* Avatars row */}
        <div className="flex items-center justify-center -space-x-[18px]">
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/DXozdDT33u.png"
            className="w-[70px] h-[70px] rounded-full border-[3px] border-white z-10"
            alt="Maria"
          />
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/AiJm57xPnT.png"
            className="w-[70px] h-[70px] rounded-full border-[3px] border-white z-20"
            alt="Sandy"
          />
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/cpRcmzqqDV.png"
            className="w-[70px] h-[70px] rounded-full border-[3px] border-white z-10"
            alt="Patrick"
          />

          {/* More button */}
          <div className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center shadow-sm z-30">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/6mh4QZBBMA.png"
              className="w-[18px] h-[18px]"
              alt="More"
            />
          </div>
        </div>

        {/* Bottom name pills */}
     <div className="absolute -bottom-[10px] left-0 right-0 flex justify-between px-[40px]">
  {/* John (slightly higher) */}
  <div className="-translate-y-[6px]">
    <NamePill name="John" variant="john" />
  </div>

  {/* Patrick (slightly lower) */}
  <div className="translate-y-[6px]">
    <NamePill name="Patrick" variant="patrick" />
  </div>
</div>
      </div>

      {/* ===== BOTTOM TEXT ===== */}
      <div className="px-[12px]">
        <h3 className="text-[20px] font-semibold text-[#080f20] leading-[24px]">
          Top Sellers
        </h3>
        <p className="text-[12px] leading-[18px] text-[#3d3d3d] mt-[4px]">
          Explore wisdom and creativity from our top Sellers.
        </p>
      </div>
    </div>
  );
}
