import HeroCard from "./HeroCard";
import AiCard from "./AiCard";
import CalmCard from "./calmcard";

export default function HeroSection() {
  return (
    <div
      className="
        w-full
        flex flex-col
        gap-[20px]
        relative
        px-3 sm:px-0
      "
    >
      {/* Top large hero card */}
      <HeroCard />

      {/* Bottom row: Calm card + AI card */}
      <div className="grid grid-cols-12 gap-[20px]">
        <div className="col-span-12 md:col-span-6">
          <CalmCard />
        </div>

        <div className="col-span-12 md:col-span-6">
          <AiCard />
        </div>
      </div>
    </div>
  );
}
