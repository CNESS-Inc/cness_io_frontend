import React from "react";
import frame1 from "../../assets/Frame 1.svg";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Cell = { left: string; starter?: React.ReactNode; premium?: React.ReactNode };

const rows: Cell[] = [
  { left: "Open-source repositories", starter: "No limits", premium: "No restrictions" },
  { left: "Open repositories", starter: "Boundless", premium: "Infinite usage" },
  { left: "Accessible repositories", starter: "Unrestricted", premium: "Unlimited access" },
  { left: "Available repositories", starter: "No boundaries", premium: "Endless possibilities" },
  { left: "Publicly accessible repositories", starter: "Unlimited potential", premium: "No limits on usage" },
  { left: "Openly available repositories", starter: "No limits on features", premium: "Unlimited functionality" },
  { left: "Open repositories for all", starter: "Unlimited capabilities", premium: "Infinite access" },
  { left: "Public repositories available", starter: "No restrictions on access", premium: "Unlimited privileges" },
  {
    left: "Publicly available repositories",
    starter: "No limits on features",
    premium: (
      <span className="inline-flex items-center gap-2 justify-center">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2ecc71]" />
        Enabled
      </span>
    ),
  },
  { left: "Open repositories for everyone", starter: "Unlimited access options", premium: "No limits on features" },
];

const Pill = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <div
    className={[
      "w-[300px] h-[53px] rounded-[12px]",
      "flex items-center justify-center",
      "font-open-sans font-normal text-[16px] leading-[21px] text-center align-middle",
      active
        ? "bg-[#979BFF] text-white shadow-[0_1px_0_rgba(0,0,0,0.08)_inset]"
        : "bg-[#979BFF] text-white/95 opacity-90"
    ].join(" ")}
  >
    {children}
  </div>
);




export default function CompareFeatures() {
  return (
<section
  className="max-w-[1900px] mx-auto mt-20 mb-20 rounded-[12px] border border-[#EDEFF3] bg-white pt-[24px] px-[18px] pb-[24px] "
>
  {/* Header */}
  <div className="flex items-center gap-3 pb-5 border-b border-[#EEF0F4]">
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EAF2FF]">
      <img src={frame1} alt="Compare Features" className="w-4 h-4" />
    </span>
    <h3 className="font-poppins text-[16px] font-medium leading-[100%] tracking-[0] text-[#081021]">
      Compare all Features
    </h3>
  </div>

  {/* Body Flex Container */}
  <div className="flex max-w-[1200px] mx-auto pt-10 gap-90 ">
    {/* Left List aligned left */}
    <ul className="flex flex-col w-[260px] text-gray-700 mt-22 -ml-60">
      {rows.map((r, i) => (
        <li
          key={i}
className="flex items-center gap-2 px-2 h-[61px] text-[14px] leading-[21px] font-poppins font-medium align-middle tracking-normal"
        >
          <span className="text-gray-400">
            <Chevron />
          </span>
          <span>{r.left}</span>
        </li>
      ))}
    </ul>

    {/* Centered pills + columns */}
    <div className="flex flex-col items-center gap-2 ">
      {/* Pills */}
      <div className="flex gap-6 mb-6 ">
        <Pill active>Starter</Pill>
        <Pill>Premium</Pill>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-8">
        {/* Starter Column */}
        <div className="border border-[#ECEEF2] rounded-xl">
          <ul className="w-[300px] bg-white">
            {rows.map((r, i) => (
              <li
                key={i}
className="h-[61px] flex items-center justify-center text-[14px] leading-[21px] font-open-sans font-normal align-middle tracking-normal text-center text-gray-700"
              >
                {r.starter ?? "-"}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Column */}
        <div className="border border-[#ECEEF2] rounded-xl bg-[#FBFAFA]">
          <ul className="w-[300px]">
            {rows.map((r, i) => (
              <li
                key={i}
className="h-[61px] flex items-center justify-center text-[14px] leading-[21px] font-open-sans font-normal align-middle tracking-normal text-center text-gray-700"
              >
                {r.premium ?? "-"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

  );
}
