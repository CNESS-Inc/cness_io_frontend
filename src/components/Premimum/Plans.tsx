import { useState, useId } from "react";
import { Check } from "lucide-react";

type Billing = "monthly" | "annual";

const PRICES = {
  free: { monthly: 0, annual: 0 },
  premium: { monthly: 12, annual: 108 },
};

/* ---------------- Single Card ---------------- */
function PricingCard({
  label,
  subtitle,
  price,

  features,
  selected = false,
  cta,
}: {
  label: string;
  subtitle: string;
  price: number | string;
  
  features: string[];
  selected?: boolean;
  cta: React.ReactNode;
}) {
  // Gradient border only when selected
  const selectedStyles = selected
    ? {
        borderWidth: "2.51px",
        borderColor: "transparent",
        backgroundImage:
          "linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(90deg, #7077FE, #F07EFF)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }
    : {
        borderWidth: "1.26px",
        borderColor: "#E1E1E1",
      };

   return (
    <div
      className="relative flex flex-col justify-between bg-white shadow-sm mx-auto w-full sm:w-[400px] lg:w-[434px]"
      style={{
        height: "641px", // Figma height fixed
        borderRadius: "22.6px",
        padding: "30px",
        borderStyle: "solid",
        ...selectedStyles,
      }}
    >
      {/* Glow (only Premium) */}
      {selected && (
        <div className="pointer-events-none absolute inset-0 rounded-[22px] overflow-hidden z-0">
          <div
            className="absolute -top-10 -right-10 w-[360px] h-[360px]"
            style={{
              background:
                "radial-gradient(340px 340px at 100% 0%, rgba(151,71,255,0.14) 0%, rgba(151,71,255,0.08) 28%, rgba(151,71,255,0.05) 48%, rgba(151,71,255,0.03) 65%, rgba(151,71,255,0.0) 82%)",
              WebkitMaskImage:
                "linear-gradient(135deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.00) 100%)",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <span
          className="inline-flex items-center justify-center mb-3 rounded-full px-3 py-2 text-[16px] leading-none font-medium bg-[#7077FE]/10 text-[#7077FE]"
          style={{
    fontFamily: "Poppins, sans-serif",
    alignSelf: "flex-start", // 👈 forces pill to left
  }}
        >
          {label}
        </span>

        <h3
          className="text-[18px] text-[#7A7A7A] leading-none font-medium mb-8"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {subtitle}
        </h3>

        <div className="mb-8">
          <p className="text-3xl font-bold text-neutral-900">${price}</p>
          <div className="w-full border-b border-neutral-300 mt-6" />
        </div>

        <h3
          className="text-[20px] text-[#102821] font-medium mb-6"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Includes:
        </h3>

        <div className="flex-1 space-y-6">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 font-open-sans text-[18px] text-[#000]"
            >
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#00C9501A]">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              {f}
            </div>
          ))}
        </div>

        <div className="mt-8">{cta}</div>
      </div>
    </div>
  );
}

/* ---------------- Toggle ---------------- */
function BillingToggle({
  value,
  onChange,
  className = "",
}: {
  value: Billing;
  onChange: (v: Billing) => void;
  className?: string;
}) {
  const id = useId();

  return (
    <div
      role="tablist"
      aria-label="Billing period"
      className={`relative inline-flex h-11 w-[328px] select-none items-center rounded-xl bg-neutral-100 px-1 shadow-sm ${className}`}
    >
      {/* Sliding thumb (160px = half width) */}
      <div
        aria-hidden
        className={`absolute top-1 bottom-1 left-1 w-[160px] rounded-[10px] bg-white transition-transform duration-300 ease-out
        ${value === "annual" ? "translate-x-[160px]" : "translate-x-0"}`}
        style={{
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      />

      <button
        id={`${id}-monthly`}
        role="tab"
        aria-selected={value === "monthly"}
        onClick={() => onChange("monthly")}
        style={{ fontFamily: "Poppins, sans-serif" }}
        className={`relative z-10 grid h-9 flex-1 place-items-center rounded-[10px] text-[16px] font-normal transition-colors
        ${value === "monthly" ? "text-neutral-900" : "text-neutral-700"}`}
      >
        Monthly
      </button>

      <button
        id={`${id}-annual`}
        role="tab"
        aria-selected={value === "annual"}
        onClick={() => onChange("annual")}
        style={{ fontFamily: "Poppins, sans-serif" }}
        className={`relative z-10 grid h-9 flex-1 place-items-center rounded-[10px] text-[16px] font-normal transition-colors
        ${
          value === "annual"
            ? "bg-clip-text text-transparent bg-gradient-to-r from-[#6340FF] to-[#D748EA]"
            : "text-neutral-700"
        }`}
      >
        Annual
      </button>
    </div>
  );
}

/* ---------------- Section ---------------- */
export default function PricingCompareSection() {
  const [billing, setBilling] = useState<Billing>("annual");

  const freePrice = PRICES.free[billing];
  const premiumPrice = PRICES.premium[billing];

  return (
    <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Toggle */}
      <div className="flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      {/* Cards */}
<div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-6 justify-start">
        {/* Free */}
        <PricingCard
          label="Free Plan"
          subtitle="Perfect for getting started"
          price={freePrice}
          features={[
            "Basic profile creation",
            "Community Access",
            "Resources Library",
            "Basic profile creation",
          ]}
          selected={false}
          cta={
            <button
              disabled
              className="w-full sm:w-[374px] rounded-full bg-[#F3F3F3] px-6 py-5 text-[17.58px] font-semibold font-plus-jakarta-sans text-[#64748B] shadow flex items-center justify-center gap-2"
            >
              Current
            </button>
          }
        />

        {/* Premium */}
        <PricingCard
          label="Premium"
          subtitle="Foundation level certification"
          price={premiumPrice}
          features={[
            "Unlock True Profile",
            "Community Access",
            "Resources Library",
            "Social media Access",
          ]}
          selected
          cta={
            <button className="w-full sm:w-[374px] rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF] px-6 py-5 text-[17.58px] font-semibold font-plus-jakarta-sans text-white shadow flex items-center justify-center gap-2 hover:from-[#7077FE] hover:to-[#7077FE]">
              Upgrade
            </button>
          }
        />
      </div>
    </section>


  );
}
