

"use client";
import insta from "../../assets/instagram.png"

type Socials = Partial<{
  linkedin: string;
  instagram: string;
  x: string;
  facebook: string;
}>;

type Props = {
  name: string;
  role: string;
  imageUrl: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  socials?: Socials;
};

export default function TeamMemberCard({
  name,
  role,
  imageUrl,
  selected = false,
  onClick,
  className = "",
  gradientFrom = "#F2CEDA",
  gradientTo = "#8575E8",
  socials,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex w-full max-w-xs sm:max-w-sm md:max-w-md ${className}`}
      aria-pressed={selected}
      style={{ lineHeight: 0 }}
    >
      {/* Gradient border if selected */}
      <div
        className={
          selected
            ? "p-[1px] rounded-[28px] bg-gradient-to-br"
            : "p-[1px] rounded-[28px] border border-[#ECEEF2]"
        }
        style={
          selected
            ? { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
            : {}
        }
      >
        {/* Card body */}
        <div
          className={`rounded-[24px] flex flex-col ${
            selected ? "bg-transparent" : "bg-white"
          }`}
        >
          <div className="flex flex-col gap-3 w-full h-full p-3 sm:p-3">
            {/* IMAGE */}
            <div className="w-full aspect-[4/3]">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover rounded-[24px]"
              />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col justify-between  rounded-[26px] md:rounded-[26px] lg:rounded-[26px]  bg-white px-5 py-4 flex-1">
              <div className="flex flex-col items-start gap-1">
                <p className="font-['Poppins'] text-base sm:text-lg md:text-xl font-medium leading-tight text-[#111827]">
                  {name}
                </p>
                <p className="font-['Open_Sans'] text-sm sm:text-base leading-snug text-[#6B7280]">
                  {role}
                </p>
              </div>

              {!!socials && (
                <div className="flex items-center gap-3 mt-5">
                  {/* Social Icons */}
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-[#0A0D1C] text-white"
                      aria-label="LinkedIn"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M4.98 3.5A2.5 2.5 0 1 1 2.48 6a2.5 2.5 0 0 1 2.5-2.5ZM3 8.98h3.96v12H3zM9.48 8.98h3.79v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.04 0 4.78 2.66 4.78 6.12v6.19h-3.96v-5.49c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9v5.59H9.48z" />
                      </svg>
                    </a>
                  )}
                  {socials.instagram && (
                   <a
  href={socials.instagram}
  target="_blank"
  rel="noreferrer"
  //className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-[#F6F5FA] text-[#111827]"
  aria-label="Instagram"
>
  <img src={insta} alt="Instagram" width={30} height={30} />
</a>
                  )}  
                  {socials.x && (
                    <a
                      href={socials.x}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-[#F6F5FA] text-[#111827]"
                      aria-label="X (Twitter)"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M3 3h4.6l4.1 5.7L16.7 3H21l-7.2 9.6L21 21h-4.6l-4.4-6.2L7.3 21H3l7.4-9.9z" />
                      </svg>
                    </a>
                  )}
                  {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-[#F6F5FA] text-[#111827]"
                      aria-label="Facebook"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M13 22v-8h3l.5-4H13V8.2c0-1.1.3-1.8 1.9-1.8H17V3.2C16.6 3.1 15.5 3 14.2 3 11.5 3 9.6 4.7 9.6 7.8V10H7v4h2.6v8H13z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover shadow */}
        {!selected && (
          <span
            className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition"
            style={{ boxShadow: "0 8px 24px rgba(16,24,40,0.10)" }}
          />
        )}
      </div>
    </button>
  );
}
