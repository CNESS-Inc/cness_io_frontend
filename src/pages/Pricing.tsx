// src/pages/UpgradePlan.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetAllPlanDetails, PaymentDetails } from "../Common/ServerAPI";
import SignupAnimation from "../components/ui/SignupAnimation";
import cnesslogo from "../assets/cnesslogo.png";
//import model from "../components/ui/Modal";

type CombinedPlan = {
  id: string;                 // fallback id
  title: string;              // plan_range (e.g., "Basic")
  monthlyAmount?: number | null;
  yearlyAmount?: number | null;
  monthlyId?: string | null;  // backend id for monthly plan
  yearlyId?: string | null;   // backend id for annual plan
  popular: boolean;
};

export default function Pricing() {
  const [plans, setPlans] = useState<CombinedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(true);
  const [error, setError] = useState<string | null>(null);
const isSinglePlan = plans.length === 1;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await GetAllPlanDetails();

        // Group API rows by plan_range and merge monthly/yearly
        const byRange: Record<string, any> = {};
        res?.data?.data?.forEach((p: any) => {
          const range = p.plan_range;
          const type = (p.plan_type || "").toLowerCase(); // "monthly" | "yearly"
          byRange[range] ||= {};
          byRange[range][type] = p;
        });

        const merged: CombinedPlan[] = Object.entries(byRange).map(
          ([range, group]: any) => ({
            id: group.yearly?.id || group.monthly?.id,
            title: range,
            monthlyAmount: group.monthly ? Number(group.monthly.amount) : null,
            yearlyAmount: group.yearly ? Number(group.yearly.amount) : null,
            monthlyId: group.monthly?.id ?? null,
            yearlyId: group.yearly?.id ?? null,
            popular: Boolean(group.yearly), // show "Popular" if annual exists
          })
        );

        setPlans(merged);
      } catch (e: any) {
        setError(
          e?.response?.data?.error?.message || "Failed to load pricing plans."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = async (plan: CombinedPlan) => {
    const chooseAnnual = isAnnual && plan.yearlyId;
    const planId = chooseAnnual ? plan.yearlyId : plan.monthlyId;
    const planType = chooseAnnual ? "Yearly" : "Monthly";

    if (!planId) return; // no option for the selected interval

    const res = await PaymentDetails({ plan_id: planId, plan_type: planType });
    const url = res?.data?.data?.url;
    if (url) window.location.href = url;
  };

  return (
  <div className="relative min-h-screen bg-white">
    {/* Hero / diagonal gradient */}
    <div className="relative h-48 sm:h-56 lg:h-64">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #F07EFF 0%, #7F57FC 50%, #5B6BFF 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 55%, 0% 100%)",
        }}
      />
      {/* Logo */}
      <div className="relative z-10 pl-5 pt-3">
        <Link to="/">
          <img
            src={cnesslogo}
            alt="logo"
            className="w-[120px] sm:w-[150px] h-auto object-contain"
          />
        </Link>
      </div>

      {/* Optional animation on the hero */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <SignupAnimation />
      </div>
    </div>

    {/* Main card (everything lives inside this card) */}
    <main className="relative z-10 -mt-14 sm:-mt-16 lg:-mt-20 px-4">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white shadow-xl ring-1 ring-gray-200 p-6 md:p-8">
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pricing Plan</h1>
          <Link
             to="/dashboard/setting?tab=billing"
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Billing
          </Link>
        </div>

        {/* Billing toggle */}
        <div className="mb-6 flex items-center justify-center gap-3 text-sm">
          <span className="text-gray-700">Monthly billing</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isAnnual}
              onChange={() => setIsAnnual((v) => !v)}
            />
            <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]">
              <span className="absolute left-[2px] top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </div>
          </label>
          <span className="text-gray-700">Annual billing</span>
        </div>

        {/* Plans */}
        <div className="rounded-4xl border border-gray-100 bg-white p-4 sm:p-6">
          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading…</div>
          ) : error ? (
            <div className="py-16 text-center text-red-600">{error}</div>
          ) : plans.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              No plans available.
            </div>
          ) : (
<div
  className={
    isSinglePlan
      ? "flex justify-center" // center the single card across the full row
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  }
>              {plans.map((plan) => {
                const showAnnual = isAnnual && plan.yearlyAmount != null;
                const price =
                  showAnnual && plan.yearlyAmount != null
                    ? `$${plan.yearlyAmount}`
                    : plan.monthlyAmount != null
                    ? `$${plan.monthlyAmount}`
                    : "—";
                const canBuy =
                  (isAnnual && plan.yearlyId) || (!isAnnual && plan.monthlyId);

                return (
                  <div key={plan.id} className="w-full max-w-md">
                    {/* gradient border card */}
      <div className="relative mx-auto rounded-3xl bg-gradient-to-r from-[#7077FE] to-[#9747FF] p-[1px]">
                      <div className="rounded-3xl bg-white p-5">
                        {plan.popular && (
                          <div className="absolute right-3 top-3 rounded-md bg-gradient-to-r from-[#7077FE] to-[#9747FF] px-2 py-0.5 text-xs text-white">
                            Popular
                          </div>
                        )}

                        <h3 className="mb-2 text-lg font-semibold">
                          {plan.title} Plan
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          Customized pricing based on your selection
                        </p>

                        <div className="mb-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">{price}</span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          {isAnnual && plan.yearlyAmount != null && (
                            <p className="mt-1 text-sm text-gray-500">
                              billed annually (${plan.yearlyAmount})
                            </p>
                          )}
                        </div>

                        <button
                          disabled={!canBuy}
                          onClick={() => handleSelect(plan)}
                          className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition
                            ${
                              canBuy
                                ? "bg-gradient-to-r from-[#7077FE] to-[#9747FF] hover:opacity-90"
                                : "cursor-not-allowed bg-gray-300"
                            }`}
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Helper note */}
        <p className="mt-4 text-center text-xs text-gray-500">
            Annual subscription — charged once per year at checkout and on renewal.
        </p>
      </div>
    </main>
  </div>
);
}
