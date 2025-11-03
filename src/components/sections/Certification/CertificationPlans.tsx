import React, { useState } from "react";
import { Check } from "lucide-react";
import aspired from "../../../assets/aspired-upgrade.png";
import inspired from "../../../assets/inspired-upgrade.png";
import leader from "../../../assets/leader.png";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

interface ApiResponse {
  is_assessment_submited: boolean;
  is_submitted_by_head: boolean;
  badge: {
    level: string;
    user_type: string;
  };
  cis_score: number;
  cis_result: any[];
}

interface Card {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  selected: boolean;
  ctaType: string;
  badge: string;
}

function TopBadge({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-13 h-13" />;
}

function PricingCard({
  card,
  onUpgrade,
}: {
  card: Card;
  onUpgrade: (plan: string) => void;
}) {
  console.log("🚀 ~ PricingCard ~ card:", card)
  const selected = !!card.selected;

  const selectedStyles: React.CSSProperties = selected
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
      className="flex p-6 flex-col bg-white mx-auto w-full h-full overflow-hidden border border-[#E1E1E1] rounded-[18px]"
      style={{
        ...selectedStyles,
      }}
    >
      <div className="w-full flex flex-col justify-center items-center gap-3">
        {card.badge && <TopBadge src={card.badge} alt={card.title} />}

        <h5 className="font-['Poppins',Helvetica] text-lg font-semibold text-[#222224]">
          {card.title}
        </h5>

        <h3 className="font-['Open_Sans',Helvetica] text-sm font-normal text-[#7A7A7A]">
          {card.subtitle}
        </h3>
      </div>
      <div className="w-full h-full border-b border-black/10 my-6"></div>

      <div className="flex flex-col justify-start text-left gap-[32px]">
        <div className="flex flex-col justify-start text-left gap-6">
          <h3 className="font-['Poppins',Helvetica] text-base text-base text-[#102821]">
            Includes:
          </h3>

          <div className="flex-1 space-y-[18px] space-x-3">
            {card.features.map((f, idx) => (
              <div
                key={idx}
                className="font-['Open_Sans',Helvetica] flex items-center gap-3 font-normal text-base"
              >
                <div
                  className="flex items-center justify-center h-6 w-6 rounded-full"
                  style={{ background: "rgba(0,201,80,0.1)" }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <div>{f}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          {card.ctaType === "pending" && (
            <button
              disabled
              className="w-full rounded-full bg-[#F3F3F3] font-['Plus Jakarta Sans'] px-6 py-4 text-sm font-medium text-[#64748B] flex items-center justify-center"
            >
              Pending for Approval
            </button>
          )}
          {card.ctaType === "completed" && (
            <button
              disabled
              className="w-full rounded-full bg-[#F3F3F3] font-['Plus Jakarta Sans'] px-6 py-4 text-sm font-medium text-[#64748B] flex items-center justify-center"
            >
              Completed
            </button>
          )}

          {card.ctaType === "continue" && (
            <button
              disabled
              className="w-full rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF] hover:from-[#897aff] hover:to-[#897aff] font-['Plus Jakarta Sans'] px-6 py-4 text-sm font-medium text-white flex items-center justify-center"
            >
              Continue Assessment
            </button>
          )}

          {card.ctaType === "upgrade" && (
            <button
              onClick={() => onUpgrade(card.title)}
              className="w-full rounded-full bg-[#7077FE] hover:bg-[#897aff] font-['Plus Jakarta Sans'] px-6 py-4 text-sm font-medium text-white flex items-center justify-center"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificationPlans({ data }: { data: ApiResponse }) {
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleUpgrade = (plan: string) => {
    if (plan === "Inspired") {
      navigate("/dashboard/assesmentcertification");
    } else if (plan === "Aspired") {
      navigate("/dashboard/assesmentcertification");
    } else if (plan === "Leader") {
      setIsOpenModal(true);
    }
  };

  const cards: Card[] = [
    {
      id: "left",
      title: "Aspired",
      subtitle: "Foundation level certification",
      price: "",
      features: [
        "Basic profile creation",
        "Community Access",
        "Resources Library",
        "Basic profile creation",
      ],
      selected: data?.badge === null,
      ctaType:
        data?.badge === null
          ? data?.is_assessment_submited
            ? data?.is_submitted_by_head
              ? "completed"
              : "pending"
            : "upgrade"
          : "completed",
      badge: aspired,
    },
    {
      id: "center",
      title: "Inspired",
      subtitle: "Professional level certification",
      price: "",
      features: [
        "Unlock True Profile",
        "Community Access",
        "Resources Library",
        "Social media Access",
      ],
      selected: data?.badge?.level === "Aspiring",
      ctaType:
        data?.badge?.level === "Aspiring"
          ? data?.is_assessment_submited
            ? data?.is_submitted_by_head
              ? "completed"
              : "pending"
            : "upgrade"
          : "upgrade",
      badge: inspired,
    },
    {
      id: "right",
      title: "Leader",
      subtitle: "Expert level certification",
      price: "",
      features: [
        "Basic profile cSell your reation",
        "Community Access",
        "Resources Library",
        "Basic profile creation",
      ],
      selected: data?.badge?.level === "Inspired",
      ctaType: "upgrade",
      badge: leader,
    },
  ];

  return (
    <section className="w-full mt-10">
      <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[18px]">
        {cards.map((c) => (
          <PricingCard key={c.id} card={c} onUpgrade={handleUpgrade} />
        ))}
      </div>
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div className="text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF] mb-4">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="openSans text-center p-4 text-[#374151]">
            Reassessment is available only after{" "}
            <span className="font-semibold text-[#7077FE]">3 months</span> from
            your last completion date.
          </div>

          <div className="mt-6">
            <Button
              onClick={() => navigate("/dashboard/assesmentcertification")}
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
            >
              Got it!
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
