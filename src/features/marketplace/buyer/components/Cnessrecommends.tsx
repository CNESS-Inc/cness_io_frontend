import { Music, Film } from "lucide-react";

const recommendations = [
  {
    name: "Work Life balance",
    avatar:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/DXozdDT33u.png",
    type: "music",
  },
  {
    name: "Raising Good Kids",
    avatar:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/cpRcmzqqDV.png",
    type: "video",
  },
];

export default function Cnessrecommends() {
  return (
   <div
  className="
    w-full
    max-w-[300px]
    sm:max-w-[265px]
    lg:max-w-[350px]
    aspect-[265/170]
    p-[12px]
    rounded-[21px]
    border border-[#CBD5E1]
    bg-[#FAFAFA]
    flex flex-col
    gap-[12px]
  "
>
      {/* Title */}
      <h3 className="font-[Poppins] text-[14px] font-medium text-[#081021]">
        Cness Recommends for you
      </h3>

      {/* List */}
      <div className="flex flex-col gap-[12px] flex-1 justify-center">
        {recommendations.map((item, index) => (
          <div key={index} className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              {/* Avatar + name */}
              <div className="flex items-center gap-[10px]">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
                <span className="font-['Open_Sans'] text-[14px] text-[#000000]">
                  {item.name}
                </span>
              </div>

              {/* Type icon */}
              {item.type === "music" ? (
                <Music className="w-[16px] h-[16px] text-[#7077FE]" />
              ) : (
                <Film className="w-[16px] h-[16px] text-[#7077FE]" />
              )}
            </div>

            {/* Divider */}
            {index < recommendations.length - 1 && (
              <div className="h-px bg-[#E5E7EB]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
