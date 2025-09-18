import React, { useEffect, useState, type ReactNode } from "react";
import {
  //ChevronRight,

  Search as SearchIcon,
  Lightbulb,
  X,
  Bell,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import profileicon from "../../assets/profileicon.svg";
import bpicon from "../../assets/bpicon.svg";
import certicon from "../../assets/certificationicon.svg";
import directoryicon from "../../assets/directoryicon.svg";
import friendsicon from "../../assets/friendsicon.svg";
import socialicon from "../../assets/socialprofileicon.svg";
import postinsight from "../../assets/post-insights-badge.svg";
import { useNavigate } from "react-router-dom";
import { GetUserNotification } from "../../Common/ServerAPI";
//import like from "../../assets/likes.svg";
//import heart from "../../assets/heart.svg";

/* ---------- Theme ---------- */
const GRADIENT = "bg-[linear-gradient(90deg,#7077FE_0%,#F07EFF_100%)]";
const BORDER = "border border-[#ECEEF2]";
const SOFT = "shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

/* ---------- Primitives ---------- */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl ${BORDER} bg-white ${SOFT} ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-white ${GRADIENT} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function OutlinePill({
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium ${BORDER} text-[#3A3F4B] bg-white hover:bg-[#F7F8FA] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF0F5]">
      <div className={`h-full ${GRADIENT}`} style={{ width: `${v}%` }} />
    </div>
  );
}

/* Small round nav arrow at top-right of each card */
//function NavArrow({
// onClick,
//label = "Open",
//}: {
//  onClick?: () => void;
//label?: string;
//}) {
// return (
//   <button
// aria-label={label}
// onClick={onClick}
// className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] text-[#7A7F8C] hover:bg-[#F7F8FA]"
// >
//  <ChevronRight className="h-4 w-4" />
//</button>
// );
//}

/* A thin divider under the card header */
function HeaderDivider() {
  return <div className="mt-3 border-t border-[#ECEEF2]" />;
}

/* ===========================================================
   PAGE GREETING + SUGGESTION BANNER
   =========================================================== */
export function GreetingBar({
  name,
  onCloseSuggestion,
}: {
  name: string;
  onCloseSuggestion?: () => void;
}) {
  return (
    <div className="mb-5 grid grid-cols-12 gap-5">
      <div className="col-span-12 lg:col-span-8">
        <h1 className="text-[26px] md:text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em]">
          Hello, <span className="text-[#7077FE]">{name}</span>
        </h1>
        <p className="mt-1 text-xs md:text-sm text-[#667085]">
          Welcome to your CNESS Dashboard
        </p>
      </div>

      <div className="col-span-12 lg:col-span-4 flex items-start lg:justify-end justify-start">
        <div className="w-full lg:min-w-[363px] lg:max-w-[400px] flex items-center gap-[10px] rounded-lg bg-[#FFCC00]/10 px-3 py-[10px] text-[#7A5A00]">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full">
            <Lightbulb className="h-4 w-4" stroke="#FFCC00" fill="#FFCC00" />
          </span>
          <span className="text-[12px] font-medium text-black leading-[100%] tracking-[0%] font-poppins">
            Next Suggested Steps
          </span>
          <button
            aria-label="Dismiss"
            onClick={onCloseSuggestion}
            className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-[#7A5A00]/70 hover:bg-white/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   1) TRUE PROFILE
   =========================================================== */
export function TrueProfileCard({
  avatarUrl,
  title = "True Profile Created",
  description = "Your profile is now complete with all the essential details added. This allows us to customize your experience!",
  completion = 100,
  onUpdateProfile,
  onOpen,
}: {
  avatarUrl: string;
  title?: string;
  description?: string;
  completion?: number;
  onUpdateProfile?: () => void;
  onOpen?: () => void;
}) {
  return (
    <Card className="p-4 md:p-5">
      {" "}
      {/* removed fixed height */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full">
            <img
              src={profileicon}
              alt="Profile Icon"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </span>
          <span className="font-poppins font-medium text-[15px] sm:text-[16px] leading-[100%] text-[#0F1728]">
            True Profile
          </span>
        </div>

        <button
          onClick={onOpen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
          aria-label="Open True Profile"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <HeaderDivider />
      {/* Body */}
      <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Circular completion ring */}
        <div className="relative shrink-0">
          <div className="relative w-[92px] h-[92px] sm:w-[108px] sm:h-[108px] rounded-full p-[3px] bg-gradient-to-r from-[#9747FF] to-[#F07EFF]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-[74px] h-[74px] sm:w-[87px] sm:h-[87px] rounded-full object-cover"
              />
            </div>
          </div>

          {/* Percentage badge */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] sm:text-[12px] font-semibold text-[#7077FE] shadow">
            {completion}%
          </span>
        </div>

        {/* Texts + Button */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="font-opensans font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[28px] md:leading-[32px] text-[#222224]">
            {title}
          </h3>

          <p className="mt-2 font-opensans font-normal text-[13px] sm:text-[14px] md:text-[16px] leading-[150%] text-[#7A7A7A]">
            {description}
          </p>

          <button
            onClick={onUpdateProfile}
            className="mt-4 sm:mt-5 inline-flex w-full sm:w-auto min-w-[140px] h-10 sm:h-[40px] items-center justify-center gap-[7px] rounded-full bg-[#7077FE] px-5 sm:px-6 font-opensans text-[13px] sm:text-[14px] leading-[100%] text-white shadow hover:bg-[#5A61E8] transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </Card>
  );
}
/* ===========================================================
   2) CERTIFICATION
   =========================================================== */
export function CertificationCard({
  progress = 82,
  onContinue,
  description = `You've successfully achieved Inspired certification and are currently working towards Inspired level. Complete the remaining requirements to unlock your next milestone.`,
  activeLevel = "Inspired",

  auto = true,
  intervalMs = 6000,
  // 👇 new (customize slide-2 content if you want)
  upgradeTitle = "Why you should upgrade to Leader",
  upgradeText = "To achieve the next level certification, you need to create a basic profile that includes selling your reactions, accessing the community, and utilizing the resources library.",
  //upgradeCtaLabel = "Upgrade",
  onUpgrade,
}: {
  progress?: number;
  onContinue?: () => void;
  description?: string;
  activeLevel?: "Aspired" | "Inspired" | "Leader";
  onOpen?: () => void;
  auto?: boolean;
  intervalMs?: number;
  upgradeTitle?: string;
  upgradeText?: string;
  upgradeCtaLabel?: string;
  onUpgrade?: () => void;
}) {
  //const levelClasses = (isActive: boolean) =>
  //`flex-1 rounded-2xl ${BORDER} p-4 text-center ${
  // isActive ? "ring-2 ring-[#8B7CFF]/40 bg-[#F8F7FF]" : "bg-white"
  //}`;

  // --- slider state ---
  const [slide, setSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!auto || paused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % 2), intervalMs);
    return () => clearInterval(id);
  }, [auto, paused, intervalMs]);

  const dotCls = (on: boolean) =>
    `h-1.5 w-1.5 rounded-full ${
      on ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
    } transition-colors`;

  return (
    <Card className="rounded-[12px] border border-[#E5E7EB] px-4 md:px-[18px] py-5 space-y-3">
      {" "}
      {/* no fixed height */}
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2EAFE]">
            <img src={certicon} alt="Certification Icon" className="h-5 w-5" />
          </span>
          <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
            Certification
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onContinue}
            className="relative w-full sm:w-[194px] h-[40px] rounded-full px-5 py-[10px] flex items-center justify-center text-center font-[600] text-[14px] text-[#222224] font-['Open_Sans'] leading-[100%] bg-white"
          >
            <span className="relative z-10">Continue Assessment</span>
            <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-[#9747FF] to-[#F07EFF]"></span>
            <span className="absolute inset-[1px] rounded-full bg-white"></span>
          </button>
        </div>
      </div>
      <HeaderDivider />
      {/* Progress */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[22px] sm:text-[24px] font-semibold font-['Open_Sans'] leading-[32px] text-[#222224]">
          {progress}%
        </span>
      </div>
      <div>
        <Progress value={progress} />
      </div>
      <p className="mt-4 text-[14px] sm:text-[16px] font-normal font-['Open_Sans'] leading-[140%] text-[#999999]">
        {description}
      </p>
      {/* Slides container */}
      <div className="mt-4">
        {/* Inner gradient card (responsive min-height) */}
        <div
          className="relative min-h-[220px] sm:min-h-[250px] rounded-[22px] border border-[#EFE8FF] bg-gradient-to-r from-[#F6F2FF] via-[#FAF0FF] to-[#FFF1F8] p-4 sm:p-6 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slide 1: Levels */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              slide === 0
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="text-[16px] sm:text-[18px] font-['Open_Sans'] leading-[100%] text-[#222224] mt-1 sm:mt-2 mb-3 sm:mb-4 px-1 sm:px-2">
              Certification Levels
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 px-1 sm:px-2">
              {/* Aspired */}
              <div
                className={`w-full h-[120px] sm:h-[150px] rounded-[18px] flex flex-col items-center justify-center gap-[10px] sm:gap-[12px] px-4 py-4 border ${
                  activeLevel === "Aspired"
                    ? "border-2 border-transparent bg-clip-padding bg-white relative before:absolute before:inset-0 before:rounded-[18px] before:p-[2px] before:bg-gradient-to-r before:from-[#7077FE] before:to-[#F07EFF] before:-z-10"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                <img
                  src="https://cdn.cness.io/aspiring.webp"
                  alt="Aspired"
                  className="h-[34px] w-[34px] sm:h-[39px] sm:w-[39px]"
                />
                <span className="font-poppins font-semibold text-[15px] sm:text-[18px] leading-[100%] text-[#0F1728]">
                  Aspired
                </span>
              </div>

              {/* Inspired */}
              <div
                className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-[2px] ${
                  activeLevel === "Inspired"
                    ? "bg-gradient-to-r from-[#7077FE] to-[#F07EFF]"
                    : "bg-[#E5E7EB]"
                }`}
              >
                <div className="w-full h-full rounded-[16px] bg-white flex flex-col items-center justify-center gap-[10px] sm:gap-[12px] px-4 py-4">
                  <img
                    src="https://cdn.cness.io/inspired.webp"
                    alt="Inspired"
                    className="h-[34px] w-[34px] sm:h-[39px] sm:w-[39px]"
                  />
                  <span className="font-poppins font-semibold text-[15px] sm:text-[18px] leading-[100%] text-[#0F1728]">
                    Inspired
                  </span>
                </div>
              </div>

              {/* Leader */}
              <div
                className={`w-full h-[120px] sm:h-[150px] rounded-[18px] flex flex-col items-center justify-center gap-[10px] sm:gap-[12px] px-4 py-4 border ${
                  activeLevel === "Leader"
                    ? "border-2 border-transparent bg-clip-padding bg-white relative before:absolute before:inset-0 before:rounded-[18px] before:p-[2px] before:bg-gradient-to-r before:from-[#7077FE] before:to-[#F07EFF] before:-z-10"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                <img
                  src="https://cdn.cness.io/leader.webp"
                  alt="Leader"
                  className="h-[34px] w-[34px] sm:h-[39px] sm:w-[39px]"
                />
                <span className="font-poppins font-semibold text-[15px] sm:text-[18px] leading-[100%] text-[#0F1728]">
                  Leader
                </span>
              </div>
            </div>
          </div>

          {/* Slide 2: Upgrade callout */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              slide === 1
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Keep the layout anchored to the top-left and within the gradient card */}
            <div className="h-full w-full flex items-start">
              {/* Two columns: fixed badge | flowing copy */}
              <div className="w-full grid grid-cols-[56px,1fr] sm:grid-cols-[64px,1fr] gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Badge */}
                <div className="flex items-start">
                  <div className="h-14 w-14 sm:h-16 sm:w-16  flex items-center justify-center">
                    <img
                      src="https://cdn.cness.io/leader1.webp"
                      alt="Leader badge"
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    />
                  </div>
                </div>

                {/* Copy + CTA */}
                <div className="min-w-0">
                  <h4 className="mr-5 -mt-1 sm:-mt-4 font-poppins font-semibold text-[18px] sm:text-[20px] leading-[32.3px] tracking-[0.15px] text-[#0F1728]">
                    {upgradeTitle}
                  </h4>

                  <p className="mt-1 font-['Open_Sans'] text-[13px] sm:text-[16px] leading-[150%] text-[#7A7A7A] max-w-[95ch]">
                    {upgradeText}
                  </p>

                  <button
                    onClick={onUpgrade}
                    className="mt-4 sm:mt-5 inline-flex w-full sm:w-auto min-w-[140px] h-10 sm:h-[40px] items-center justify-center gap-[7px] rounded-full bg-[#7077FE] px-5 sm:px-6 font-opensans text-[13px] sm:text-[14px] leading-[100%] text-white shadow hover:bg-[#5A61E8] transition"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots BELOW the gradient card */}
        <div className="pt-3 flex justify-center">
          <div className="flex gap-1.5">
            <button
              aria-label="Slide 1"
              className={dotCls(slide === 0)}
              onClick={() => setSlide(0)}
            />
            <button
              aria-label="Slide 2"
              className={dotCls(slide === 1)}
              onClick={() => setSlide(1)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ===========================================================
   4) BEST PRACTICES (left column, below Certification)
   =========================================================== */
type BestPractice = {
  id: string | number;
  image: string;
  title: string;
  description: string;
};

function CircleIconBtn({
  onClick,
  children,
  ariaLabel,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] text-[#7A7F8C] hover:bg-[#F7F8FA]"
    >
      {children}
    </button>
  );
}

export function BestPracticesSection({
  items,
  onAdd,
  onFollow,
  title = "Best Practices",
}: {
  items: BestPractice[];
  onAdd?: () => void;
  onFollow?: (bp: BestPractice) => void;
  title?: string;
}) {
  // Desktop: simple 2-up pager
  const pageSize = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const [page, setPage] = React.useState(0);
  const start = page * pageSize;
  const visible = items.slice(start, start + pageSize);
  const next = () => setPage((p) => (p + 1) % totalPages);
  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  // Mobile: horizontal scrolling with snap
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [mobileIndex, setMobileIndex] = React.useState(0);

  // Scroll one card at a time on mobile
  const CARD_W = 332; // keep your fixed card width
  const GAP = 16; // gap-4 -> 16px
  const scrollByCard = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollLeft / (CARD_W + GAP));
      setMobileIndex(Math.max(0, Math.min(items.length - 1, i)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <Card className="p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF4FF]">
            <img src={bpicon} alt="Best Practices Icon" className="h-10 w-10" />
          </span>
          <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <OutlinePill onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add Best Practices
          </OutlinePill>
        </div>
      </div>
      <HeaderDivider />
      {items.length > 0 ? (
      <>
        {/* Subheader + arrows (desktop arrows only) */}
        <div className="mt-3 flex items-center justify-between">
          <div className="font-opensans text-[14px] leading-[100%] text-[#222224]">
            Recommended
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <CircleIconBtn ariaLabel="Previous" onClick={prev}>
              <ArrowLeft className="h-4 w-4" />
            </CircleIconBtn>
            <CircleIconBtn ariaLabel="Next" onClick={next}>
              <ArrowRight className="h-4 w-4" />
            </CircleIconBtn>
          </div>
        </div>

        {/* --- MOBILE list (horizontal scroll, snap) --- */}
        <div className="relative sm:hidden mt-3">
          {/* Fade edges to hint scroll */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />

          {/* Scrollable row */}
          <div
            ref={listRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2
                      [-ms-overflow-style:none] [scrollbar-width:none]
                      [&::-webkit-scrollbar]:hidden"
          >
            {items.map((bp) => (
              <div
                key={bp.id}
                className="snap-start flex-shrink-0 w-[332px] h-[317px] rounded-[12px] border border-[#ECEEF2] bg-white p-3 flex flex-col gap-3"
              >
                {/* Image */}
                <div className="h-[135px] rounded-[8px] overflow-hidden">
                  <img
                    src={bp.image}
                    alt={bp.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <div className="font-poppins font-medium text-[16px] leading-[120%] text-[#0F1728]">
                    {bp.title}
                  </div>
                  <p className="mt-3 font-opensans text-[14px] leading-[150%] text-[#667085] line-clamp-2">
                    {bp.description}
                  </p>
                  <button
                    className="mt-auto w-full h-[37px] rounded-full bg-[#7077FE] px-3 py-2
                              font-opensans text-[14px] font-semibold text-white
                              shadow hover:bg-[#5A61E8] transition"
                    onClick={() => onFollow?.(bp)}
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tiny overlay arrows for mobile (optional) */}
          <button
            onClick={() => scrollByCard(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-[#E4E7EC] shadow-sm flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-4 w-4 text-[#7A7F8C]" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-[#E4E7EC] shadow-sm flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-4 w-4 text-[#7A7F8C]" />
          </button>
        </div>

        {/* --- DESKTOP list (keep your 2-up pager) --- */}
        <div className="mt-3 hidden sm:flex gap-4">
          {visible.map((bp) => (
            <div
              key={bp.id}
              className="flex-shrink-0 w-[332px] h-[317px] rounded-[12px] border border-[#ECEEF2] bg-white p-3 flex flex-col gap-3"
            >
              <div className="h-[135px] rounded-[8px] overflow-hidden">
                <img
                  src={bp.image}
                  alt={bp.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="font-poppins font-medium text-[16px] leading-[120%] text-[#0F1728]">
                  {bp.title}
                </div>
                <p className="mt-3 font-opensans text-[16px] leading-[150%] text-[#667085] line-clamp-2">
                  {bp.description}
                </p>
                <button
                  className="mt-auto w-full h-[37px] rounded-full bg-[#7077FE] px-3 py-2
                            font-opensans text-[14px] font-semibold text-white
                            shadow hover:bg-[#5A61E8] transition"
                  onClick={() => onFollow?.(bp)}
                >
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dots: mobile shows one dot per card; desktop shows one per page */}
        {/* Mobile dots */}
        <div className="mt-4 flex justify-center gap-1 sm:hidden">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === mobileIndex ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
              }`}
            />
          ))}
        </div>

        {/* Desktop dots */}
        <div className="mt-4 hidden sm:flex justify-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === page ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
              }`}
            />
          ))}
        </div>
      </>
      ) : (
        <>
          <div className="text-center text-sm text-[#667085] py-4">
            <div className="py-8">
              <svg
                className="w-20 h-20 text-purple-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                No data available!
              </h2>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export function SocialStackCard({
  // profile
  coverUrl,
  avatarUrl,
  name,
  handle,
  resonating = 100,
  resonators = 1000,
  //onViewProfile,
  // onSearch,
  onOpen,

  // adventure
  adventureTitle = "Your Next Social Life Adventure",
  adventureText = "What would your younger self admire about your life now? Any standout achievements or experiences?",
  onStartPosting,
  onViewFeed,

  // friends
  suggested,
  requested,
  onConnect,
}: {
  coverUrl: string;
  avatarUrl: string;
  name: string;
  handle: string;
  resonating?: any;
  resonators?: any;
  onViewProfile?: () => void;
  onSearch?: (q: string) => void;
  onOpen?: () => void;

  adventureTitle?: string;
  adventureText?: string;
  onStartPosting?: () => void;
  onViewFeed?: () => void;

  suggested: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
  }[];
  requested: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
  }[];
  onConnect?: (f: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
  }) => void;
}) {
  const [tab, setTab] = React.useState<"Suggested" | "Requested">("Suggested");
  const list = tab === "Suggested" ? suggested : requested;
  const navigate = useNavigate();

  type AdventureSlide = {
    title: string;
    text: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  };

  function MarqueeColumn({
    images,
    side, // "left" | "right"
    reverse = false, // right side uses reverse for downwards scroll
  }: {
    images: string[];
    side: "left" | "right";
    reverse?: boolean;
  }) {
    // duplicate list for seamless loop
    const list = [...images, ...images];
    const sideClass = side === "left" ? "-left-3" : "-right-3";
    const fadeSide = side === "left" ? "right-0" : "left-0";
    const fadeDir = side === "left" ? "bg-gradient-to-r" : "bg-gradient-to-l";

    return (
      <div
        aria-hidden
        className={`absolute inset-y-0 ${sideClass} w-12 overflow-hidden pointer-events-none hidden sm:block`}
      >
        <div
          className={`flex flex-col gap-2 ${
            reverse ? "marquee-ping-reverse" : "marquee-ping"
          }`}
        >
          {list.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              className="h-10 w-10 rounded-lg object-cover border border-white/60 shadow"
            />
          ))}
        </div>

        {/* soft edge fade so images blend into the card */}
        <div
          className={`pointer-events-none absolute ${fadeSide} top-0 bottom-0 w-2 ${fadeDir} from-[#FCFCFF]/0 via-[#FCFCFF]/20 to-transparent`}
        />
      </div>
    );
  }

  /* ===== 3-slide carousel for the Adventure section ===== */
  function AdventureSlides({
    slides,
    leftImages,
    rightImages,
    onPrimary,
    onSecondary,
    auto = true,
    intervalMs = 6000,
    reactions,
  }: {
    slides: AdventureSlide[];
    leftImages: string[];
    rightImages: string[];
    onPrimary?: () => void;
    onSecondary?: () => void;
    auto?: boolean;
    intervalMs?: number;
    reactions?: { topRight?: string; bottomLeft?: string }; // NEW
  }) {
    const [idx, setIdx] = React.useState(0);
    const [paused, setPaused] = React.useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    React.useEffect(() => {
      if (!auto || paused) return;
      const id = setInterval(
        () => setIdx((i) => (i + 1) % slides.length),
        intervalMs
      );
      return () => clearInterval(id);
    }, [auto, paused, intervalMs, slides.length]);

    const s = slides[idx];

    const ReactionBubble = ({
      src,
      className = "",
    }: {
      src?: string;
      className?: string;
    }) =>
      src ? (
        <img
          src={src}
          className={`absolute h-8 w-8 object-contain drop-shadow-md ${className}`}
        />
      ) : null;

    const getNotification = async () => {
      try {
        const res = await GetUserNotification();

        if (res?.data?.data) {
          // Get first 10 notifications from the API response
          const firstTenNotifications = res.data.data.slice(0, 3);
          setNotifications(firstTenNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    useEffect(() => {
      getNotification();
    }, []);

    /* ---------- helpers ---------- */

    const InsightsCard = () => (
      <div className="row-start-1 relative z-10 place-self-center w-full max-w-[620px]">
        {/* badge */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#A996FF]">
          <img src={postinsight} alt="post" className="w-10 h-10" />
        </div>

        <h3 className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
          Post Insights
        </h3>
        <p className=" mt-2 max-w-[32rem] mx-auto text-[12px] leading-[100%] text-[#667085] font-[400] text-center font-['Open_Sans']">
          {s.text /* e.g. "Posted on May 10,2024" */}
        </p>

        {/* white stat card */}
        <div className="mt-2 rounded-2xl border border-[#EEF0F5] bg-white p-5 shadow-sm">
          {/* Account Reached */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
                Account Reached
              </div>
              <div className="mt-2 text-[18px] font-semibold text-[#F07EFF]">
              {Intl.NumberFormat().format(resonating)}
              </div>
            </div>

            {/* dot chart (pink) */}
            {/* dot chart (pink - horizontal with peak) */}
            <div className="flex flex-row items-end gap-1">
              {/* Column 1 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>

              {/* Column 2 (5 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>

              {/* Column 3 (3 dots - peak) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>

              {/* Column 4 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-[#E9EDF3]" />

          {/* Followers */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
                Followers
              </div>
              <div className="mt-2 text-[18px] font-semibold text-[#8B7CFF]">
                +{Intl.NumberFormat().format(resonators)}
              </div>
            </div>

            {/* dot chart (purple) */}
            <div className="flex flex-row items-end gap-1">
              {/* Column 1 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>

              {/* Column 2 (5 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>

              {/* Column 3 (3 dots - peak) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>

              {/* Column 4 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    const NotificationsCard = ({ notifications }: { notifications: any[] }) => {
      console.log("🚀 ~ NotificationsCard ~ notifications:", notifications);
      return (
        <div className="row-start-1 relative z-10 place-self-center w-full max-w-[620px]">
          {/* header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7E9FF]">
              <Bell className="h-4 w-4 text-[#B255FF]" />
            </div>
            <h3 className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
              Notification
            </h3>
          </div>

          {/* rows */}
          <div className="mt-2 space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-[#EEF0F5] bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={`https://i.pravatar.cc/56?u=${item.sender_id}`} // avatar placeholder based on sender_id
                    className="h-11 w-11 rounded-full object-cover"
                    alt=""
                  />
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-[#0F1728]">
                      {/*{item.sender_profile.first_name}{" "}
                      {item.sender_profile.last_name}*/}
                    </div>
                    <div className="truncate text-[14px] text-[#98A2B3]">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F5] bg-white shadow-sm">
                  <MoreHorizontal className="h-4 w-4 text-[#8F9AA6]" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full text-white text-[14px] font-semibold bg-[linear-gradient(90deg,#7077FE_0%,#9747FF_60%,#F07EFF_100%)] shadow"
            onClick={() => navigate("/dashboard/notification")}
          >
            View all Notification
          </button>
        </div>
      );
    };

    /* ---------- render ---------- */
    return (
      <>
        <div
          className="relative h-[360px] rounded-[12px] border border-[#ECEEF2] px-[12px] py-[18px] overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* side marquees & static reaction bubbles only on slide 1 */}
          {idx === 0 && (
            <>
              <MarqueeColumn side="left" images={leftImages} />
              <MarqueeColumn side="right" images={rightImages} reverse />
              <ReactionBubble
                src={reactions?.topRight}
                className="right-3 top-3"
              />
              <ReactionBubble
                src={reactions?.bottomLeft}
                className="left-3 bottom-6"
              />
            </>
          )}

          {/* content */}
          {idx === 0 ? (
            <div className="relative z-10 h-full grid place-items-center text-center">
              <div>
                <h4 className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
                  {s.title}
                </h4>
                <p className="mt-2 max-w-[32rem] mx-auto text-[14px] leading-[100%] text-[#667085]  font-[400] text-center font-['Open_Sans']">
                  {s.text}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <PrimaryButton onClick={onPrimary}>
                    {s.primaryLabel ?? "Start Posting"}
                  </PrimaryButton>
                  <OutlinePill onClick={onSecondary}>
                    {s.secondaryLabel ?? "View Feed"}
                  </OutlinePill>
                </div>
              </div>
            </div>
          ) : idx === 1 ? (
            <InsightsCard />
          ) : (
            <NotificationsCard notifications={notifications} />
          )}

          {/* marquee animations */}
          <style>{`
            @keyframes marqueePing { 0%,12% { transform: translateY(0) } 88%,100% { transform: translateY(-50%) } }
            .marquee-ping { animation: marqueePing 2s linear infinite; animation-direction: alternate; }
            .marquee-ping-reverse { animation: marqueePing 2s linear infinite; animation-direction: alternate-reverse; }
          `}</style>
        </div>

        {/* Dots OUTSIDE the card so they’re always visible */}
        <div className="flex justify-center gap-1.5 pt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full ${
                i === idx ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
              }`}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <Card className="p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF4FF]">
            <img
              src={socialicon}
              alt="Best Practices Icon"
              className="h-10 w-10"
            />
          </span>
          <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
            Social Profile
          </span>
        </div>

        <button
          onClick={onOpen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <HeaderDivider />

      {/* Search */}
      <div
        className="mt-2 flex items-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-3"
        onClick={() => navigate("/dashboard/feed")}
      >
        <input
          className="h-10 w-full outline-none text-sm"
          placeholder="Search…"
          // onChange={(e) => onSearch?.(e.target.value)}
          // onClick={(e) => e.stopPropagation()}
        />
        <SearchIcon className="h-4 w-4 text-[#667085]" />
      </div>

      {/* ===== Section 1: Profile preview ===== */}
      <div className=" mt-4 h-[290px] rounded-xl border border-[#ECEEF2] p-3 flex flex-col gap-3">
        {/* Cover */}
        <img
          src={coverUrl}
          alt=""
          className="h-[149px] w-full rounded-[12px] object-cover"
        />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="min-w-0 w-full">
            {/* top row: name (left) + metrics (right) */}
            <div className="flex items-center gap-3">
              <div className="min-w-0 truncate font-poppins font-medium text-[18px] leading-[30px] text-[#222224]">
                {name}
              </div>

              {/* metrics – right aligned */}
              <div className="ml-auto shrink-0 flex items-center gap-4 text-[14px] mr-20">
                <span className="whitespace-nowrap">
                  <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#7077FE]">
                    {resonating}
                  </span>
                  <span className="ml-1 font-['Plus_Jakarta_Sans'] font-normal text-[11px] leading-[100%] text-[#667085]">
                    Resonating
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#A855F7]">
                    {Intl.NumberFormat().format(resonators)}
                  </span>
                  <span className="ml-1 font-['Plus_Jakarta_Sans'] font-normal text-[11px] leading-[100%] text-[#667085]">
                    Resonators
                  </span>
                </span>
              </div>
            </div>

            {/* handle below */}
            <div className="truncate font-opensans text-[14px] text-[#222224]/50">
              @{handle}
            </div>
          </div>
        </div>
        {/* Button */}
        <button
          className="mt-auto w-full flex items-center justify-center gap-[7.09px] 
             h-[34px] rounded-[100px] bg-[#7077FE] 
             px-[24px] py-[12px] 
             font-opensans font-normal text-[14px] leading-[100%] text-white 
             shadow hover:bg-[#5A61E8] transition"
          onClick={() => navigate("/dashboard/Profile")}
        >
          View Profile
        </button>
      </div>

      {/* section divider */}
      <div className="my-4 border-t border-[#ECEEF2]" />

      {/* ===== Section 2: Your Next Social Life Adventure ===== */}
      <AdventureSlides
        slides={[
          {
            title: adventureTitle,
            text: adventureText,
            primaryLabel: "Start Posting",
            secondaryLabel: "View Feed",
          },
          {
            title: "Post Insights",
            text: "Posted on May 10,2024",
            primaryLabel: "Create Post",
            secondaryLabel: "Open Feed",
          },
          {
            title: "Ask the community",
            text: "Start a discussion and get feedback from experienced sellers in minutes.",
            primaryLabel: "Start Thread",
            secondaryLabel: "Browse Topics",
          },
        ]}
        leftImages={[
          "https://i.pravatar.cc/60?img=21",
          "https://i.pravatar.cc/60?img=22",
          "https://i.pravatar.cc/60?img=23",
          "https://i.pravatar.cc/60?img=24",
          "https://i.pravatar.cc/60?img=25",
        ]}
        rightImages={[
          "https://i.pravatar.cc/60?img=31",
          "https://i.pravatar.cc/60?img=32",
          "https://i.pravatar.cc/60?img=33",
          "https://i.pravatar.cc/60?img=34",
          "https://i.pravatar.cc/60?img=35",
        ]}
        onPrimary={onStartPosting}
        onSecondary={onViewFeed}
        reactions={{
          topRight: "../likes.svg", // your “like” image
          bottomLeft: "../heart.svg", // your “heart” image
        }}
        auto
        intervalMs={6000}
      />

      {/* section divider */}
      <div className="my-4 border-t border-[#ECEEF2]" />

      {/* ===== Section 3: Friends ===== */}
      <div
        className="h-[393px] rounded-[12px] border border-[#ECEEF2] 
             px-[12px] py-[18px] flex flex-col gap-[18px]"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
            <img src={friendsicon} alt="directory Icon" className="h-10 w-10" />
          </span>
          <span className="text-[16px] font-medium font-Poppins text-[#222224]">
            Friends
          </span>
        </div>

        {/* pill tabs */}
        <div
          role="tablist"
          className="relative inline-grid w-full max-w-[320px] grid-cols-2 rounded-full border border-[#ECEEF2] bg-white p-1 select-none"
        >
          {/* sliding thumb */}
          <div
            className="absolute top-1 bottom-1 rounded-full bg-[#7077FE] shadow-sm transition-all duration-200"
            style={{
              width: "calc(50% - 8px)", // 8px = p-1*2
              left: tab === "Suggested" ? 4 : "calc(50% + 4px)", // slide left/right
            }}
          />

          {/* buttons */}
          <button
            role="tab"
            aria-selected={tab === "Suggested"}
            onClick={() => setTab("Suggested")}
            className={`relative z-10 h-8 text-center text-sm font-semibold rounded-full transition-colors ${
              tab === "Suggested" ? "text-white" : "text-[#222224]"
            }`}
          >
            Suggested
          </button>

          <button
            role="tab"
            aria-selected={tab === "Requested"}
            onClick={() => setTab("Requested")}
            className={`relative z-10 h-8 text-center text-sm font-semibold rounded-full transition-colors ${
              tab === "Requested" ? "text-white" : "text-[#222224]"
            }`}
          >
            Requested
          </button>
        </div>

        {/* list */}
        <div className="space-y-3 flex-1">
          {list && list.length > 0 ? (
            list.slice(0, 5).map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={f.avatar}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#0F1728]">
                      {f.name}
                    </div>
                    <div className="truncate text-xs text-[#667085]">
                      {f.handle}
                    </div>
                  </div>
                </div>
                <OutlinePill
                  className="h-9 px-3"
                  onClick={() => onConnect?.(f)}
                >
                  <UserPlus className="h-4 w-4" />
                  Connect
                </OutlinePill>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-[#667085] py-4">
              No data available
            </div>
          )}
        </div>

        <PrimaryButton
          className="w-full rounded-3xl"
          onClick={() => navigate("/dashboard/MyConnection")}
        >
          See More{" "}
        </PrimaryButton>
      </div>
    </Card>
  );
}

/* ===========================================================
   7) DIRECTORY (left column, under Best Practices)
   =========================================================== */
type DirectoryItem = {
  name: string | undefined;
  handle: ReactNode;
  avatar: string | undefined;
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
};

export function DirectorySection({
  items,
  title = "Directory",
  onView,
}: {
  items: DirectoryItem[];
  title?: string;
  onView?: (item: DirectoryItem) => void;
}) {
  const navigate = useNavigate();
  return (
    <Card className="p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
            <img
              src={directoryicon}
              alt="directory Icon"
              className="h-10 w-10"
            />
          </span>
          <span className="text-sm font-semibold text-[#0F1728]">{title}</span>
        </div>

        <button
          //onClick={onOpen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
        >
          <ArrowUpRight
            className="h-4 w-4"
            onClick={() => navigate("/dashboard/DashboardDirectory")}
          />
        </button>
      </div>
      <HeaderDivider />

      {/* List */}
      <div className="mt-3 space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#ECEEF2] bg-white p-3 shadow-sm"
          >
            {/* Left: image + text */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={it.avatar}
                alt={it.name}
                className="h-12 w-12 rounded-xl object-cover"
              />

              <div className="min-w-0">
                <div className="font-poppins font-semibold text-[16px] sm:text-[18px] leading-[120%] text-[#0F1728] truncate">
                  {it.name}
                </div>
                <div className="font-opensans text-[14px] sm:text-[16px] leading-[140%] text-[#667085] truncate">
                  {it.handle}
                </div>
              </div>
            </div>

            {/* Right: button */}
            <button
              onClick={() => onView?.(it)}
              className={`w-full sm:w-[127px] h-[32px] rounded-full px-4 py-2 text-center font-opensans text-[14px] text-white ${GRADIENT}`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
