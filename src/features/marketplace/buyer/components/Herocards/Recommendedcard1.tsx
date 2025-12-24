import {MessageSquareMoreIcon} from "lucide-react"
import nandhiji from "../../../../../assets/nandhiji.svg";
import play from "../../../../../assets/play.svg";
export default function Recommendedcard1() {
  return (
    <div className="w-full h-full rounded-[15px] border border-[#ecebeb] overflow-hidden">
      <div
        className="
          relative
          w-full
          h-full
          p-[20px]
          bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-12-18/e56dc016-8e05-4d16-b401-e4ff7861191c.png)]
          bg-cover
          bg-center
          flex
          flex-col
          justify-between
        "
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* ================= TOP CONTENT ================= */}
        <div className="relative z-10 flex flex-col gap-[10px]">
          {/* Pill */}
          <span className="inline-flex w-fit px-[12px] py-[4px] bg-white/20 rounded-full text-[12px] text-white">
            Recommendation for you
          </span>

          {/* Title */}
          <h2 className="text-white text-[38px] font-semibold leading-[46px] tracking-[-0.3px]">
            Dance of <br /> Siddhars
          </h2>

          {/* Rating + messages */}
          <div className="flex items-center gap-[10px]">
            {/* Stars */}
            <div className="flex gap-[4px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-yellow-400 text-[14px]">
                  ★
                </span>
              ))}
            </div>

            {/* Message count */}
            <div className="flex items-center gap-[4px] text-white text-[12px]">
              <MessageSquareMoreIcon className="w-[14px] h-[14px]" />
              <span>97</span>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM CONTENT ================= */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Profile */}
          <div className="flex items-center gap-[8px]">
            <img
              src={nandhiji}
              className="w-[28px] h-[28px] rounded-full"
              alt="Nandhiji"
            />
            <span className="text-white text-[12px]">Nandhiji</span>
          </div>

          {/* Play button */}
          <div className="w-[44px] h-[44px]  flex items-center justify-center">
            <img
              src={play}
              className="w-[44px] h-[44px]"
              alt="play"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
