import React from "react";
import frame1 from "../../assets/Frame 1.svg";

//const Chevron = () => (
  //<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
   /// <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  //</svg>
//);

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

const COL_W = "w-[300px]"; // single place to control column width on desktop

const Pill = ({ children }: { children: React.ReactNode; active?: boolean }) => (
  <div
    className={[
      "h-[53px] rounded-[12px] px-6",
      "flex items-center justify-center",
      "font-open-sans text-[16px] leading-[21px]",
      "bg-[#979BFF] text-white shadow-[0_1px_0_rgba(0,0,0,0.08)_inset]",
      "w-full", // make pill stretch the column width
    ].join(" ")}
  >
    {children}
  </div>
);

export default function CompareFeatures() {
  return (
    <section className="mx-auto mt-10 mb-16 rounded-[12px] border border-[#EDEFF3] bg-white p-6 sm:p-8 max-w-[1900px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-[#EEF0F4]">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EAF2FF]">
          <img src={frame1} alt="Compare Features" className="w-4 h-4" />
        </span>
        <h3 className="font-poppins text-[16px] sm:text-[18px] font-medium text-[#081021]">Compare all Features</h3>
      </div>

      {/* ---------- MOBILE (cards) ---------- */}
      <div className="mt-8 space-y-4 md:hidden">
        <div className="flex gap-3">
          <div className="flex-1">
            <Pill active>Starter</Pill>
          </div>
          <div className="flex-1">
            <Pill>Premium</Pill>
          </div>
        </div>

        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-[#ECEEF2] p-4 bg-white">
            <div className="flex items-center gap-2 text-[14px] font-poppins text-[#0f172a] mb-3">
              {/*<span className="text-gray-400">
                <Chevron />
              </span>*/}
              <span>{r.left}</span>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#ECEEF2] p-3">
                <div className="text-[12px] text-gray-500 mb-1">Starter</div>
                <div className="text-[14px] font-open-sans text-gray-700">{r.starter ?? "-"}</div>
              </div>
              <div className="rounded-lg border border-[#ECEEF2] p-3 bg-[#FBFAFA]">
                <div className="text-[12px] text-gray-500 mb-1">Premium</div>
                <div className="text-[14px] font-open-sans text-gray-700">{r.premium ?? "-"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- DESKTOP/TABLET (no inner borders, long pills) ---------- */}
  <div className="hidden md:block mt-23">
  <div className="flex items-start gap-8 justify-center">
    {/* Left labels – add the same top offset used inside columns */}
    <ul className="min-w-[300px] pt-6">
      {rows.map((r, i) => (
        <li
          key={i}
          className="flex items-center gap-2 pl-0 pr-4 h-[61px] text-[14px] font-poppins text-[#000000] font-medium"
        >
          {/*<span className="text-gray-400">
            <Chevron />
          </span>*/}
          <span>{r.left}</span>
        </li>
      ))}
    </ul>

    {/* Starter Column */}
<div className={`relative rounded-xl border border-[#ECEEF2] bg-white px-5 pb-5 pt-6 ${COL_W}`}>
      {/* FLOATING pill (outside the box) */}
  <div className="absolute -top-15 left-0 w-full px-1">
        <Pill>Starter</Pill>
      </div>

      {/* Content – no extra margin before the first row */}
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={i}
            className="h-[53.5px] flex items-center justify-center text-[14px] font-open-sans text-gray-700 text-center rounded-md"
          >
            {r.starter ?? "-"}
          </li>
        ))}
      </ul>
    </div>

    {/* Premium Column */}
<div className={`relative rounded-xl border border-[#ECEEF2] bg-[#FBFAFA] px-5 pb-5 pt-6 ${COL_W}`}>
      {/* FLOATING pill (outside the box) */}
  <div className="absolute -top-15 left-0 w-full px-1">
        <Pill>Premium</Pill>
      </div>

      {/* Content */}
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={i}
            className="h-[53.5px] flex items-center justify-center text-[14px] font-open-sans text-gray-700 text-center rounded-md"
          >
            {r.premium ?? "-"}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
    </section>
  );
}
