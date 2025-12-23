import { BellIcon, PlayIcon } from "lucide-react";
import StarRating from "./Ui/StarRating";
import cnessLogo from "../../../../assets/cness.png";

export default function SingleSeller({
    title,
    description,
    image,
    // impactor,
    rating,
    url
}: any) {
    console.log("SingleSeller Props:", rating.toFixed(1));
    return (
        <div
            className="
                w-full
                flex flex-col sm:flex-row
                gap-3 sm:gap-4
                p-3 sm:p-[15px]
                rounded-[18px] sm:rounded-[22px]
                border border-[#F3F3F3]
                bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]
                transition-all
            "
        >
            {/* ===== IMAGE ===== */}
            <div
                className="
                    relative
                    w-full
                    sm:w-[40%] md:w-[45%] lg:w-[50%]
                    sm:max-w-[260px]
                    lg:max-w-[341px]
                    xl:max-w-[535px]
                    aspect-[4/3] sm:aspect-[341/327] lg:aspect-[535/529]
                    rounded-[14px] sm:rounded-[18px]
                    overflow-hidden
                    flex-shrink-0
                    mx-auto sm:mx-0
                "
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* ===== CONTENT ===== */}
            <div className="flex flex-col flex-1">
                {/* ===== CONTENT ===== */}
                <div className="flex justify-center flex-1 min-w-0 py-[6px]">
                    <div className="space-y-[12px]">
                        <h3 className="font-poppins font-medium text-[34px] leading-[44.2px] tracking-normal text-[#363842]">
                            {title}
                        </h3>

                        <p className="font-open-sans font-normal text-[16px] leading-[25.6px] tracking-normal text-[#363842]">
                            {description}
                        </p>
                        <p className="font-poppins font-medium text-[12px] leading-[14.4px] tracking-normal text-[#7077FE]">
                            {url}
                        </p>

                        {/* Use the StarRating component */}
                        <div className="flex items-center mb-4">
                            <span className="me-1 text-[16px] font-medium text-[#242424]">
                                {rating.toFixed(1)}
                            </span>
                            <StarRating rating={rating} />
                        </div>
                        <div className="mb-2.5">
                            <button className="font-poppins font-medium text-[12px] leading-[14.4px] tracking-normal text-center text-[#7077FE] underline underline-offset-[25%] decoration-[10%] decoration-solid decoration-skip-ink">
                                <PlayIcon fill="#7077FE" size={15} className="inline-block me-2" />
                                Know me from myself
                            </button>
                        </div>
                        <div className="mb-2.5">
                            <div
                                className="
                                    relative
                                    w-full
                                    sm:w-[40%] md:w-[45%] lg:w-[50%]
                                    max-w-[342px]
                                    aspect-[3/2]
                                    rounded-[14px] sm:rounded-[18px]
                                    overflow-hidden
                                    flex-shrink-0
                                    mx-auto sm:mx-0
                                "
                            >
                                <img
                                    src={image}
                                    alt={title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* IMPACTOR */}
                <div className="pt-[10px] mt-auto">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
                        {/* Primary Message Button - Full width on mobile, auto on desktop */}
                        <button className="
                            opacity-100
                            rounded-[9.98px]
                            px-4
                            py-3.5
                            sm:py-4.5
                            bg-[#7077FE]
                            font-poppins
                            font-medium
                            text-[12px]
                            leading-[120%]
                            tracking-normal
                            text-center
                            text-white
                            border-none
                            cursor-pointer
                            outline-none
                            hover:opacity-90
                            active:opacity-80
                            transition-opacity
                            sm:me-3.5
                            w-full sm:w-auto
                            order-1
                        ">
                            Message
                        </button>

                        {/* Connect Button - Full width on mobile, auto on desktop */}
                        <button className="
                            flex items-center justify-center
                            gap-[5px]
                            opacity-100
                            rounded-[9.98px]
                            border
                            border-[#291B89]
                            px-4
                            py-3
                            sm:py-3.5
                            text-[#291B89]
                            font-poppins
                            font-medium
                            text-[12px]
                            leading-[120%]
                            tracking-normal
                            text-center
                            hover:opacity-90
                            active:opacity-80
                            transition-opacity
                            sm:me-2.5
                            w-full sm:w-auto
                            order-2
                        ">
                            <img src={cnessLogo} className="w-[14px] h-[20px]" alt="" />
                            <span className="whitespace-nowrap">Connect with me</span>
                        </button>

                        {/* Get Notified Button - Icon only on mobile, full text on desktop */}
                        <button className="
                            flex items-center justify-center sm:justify-start
                            gap-[5px]
                            font-poppins
                            font-medium
                            text-[12px]
                            leading-[120%]
                            tracking-normal
                            text-center sm:text-left
                            text-[#7077FE]
                            hover:opacity-90
                            active:opacity-80
                            transition-opacity
                            py-2
                            sm:py-0
                            w-full sm:w-auto
                            order-3 sm:order-3
                        ">
                            <BellIcon className="w-[14px] h-[20px] flex-shrink-0" />
                            <span className="hidden sm:inline">Get Notified</span>
                            <span className="sm:hidden">Get Notified</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}