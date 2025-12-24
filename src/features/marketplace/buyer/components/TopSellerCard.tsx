import StarRating from "./Ui/StarRating";

/* ---------------- TYPES ---------------- */

interface SellerCardProps {
    title: string;
    description: string;
    rating: number;
    image: string;
    impactor: boolean;
}
/* ---------------- COMPONENT ---------------- */

export default function TopSellerCard(props: SellerCardProps) {
    const {
        title,
        description,
        rating,
        image,
        impactor
    } = props;

    return (
        <div
            className="
                w-full
                max-w-[265px] lg:w-[265px]
                rounded-[22px]
                border border-[#F3F3F3]
                bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]
                overflow-hidden
                flex flex-col
                transition hover:shadow-lg
            "
        >
            {/* ===== IMAGE ===== */}
            <div
                className="
                    relative
                    w-full
                    sm:w-[40%] md:w-[45%] lg:w-[50%]
                    lg:w-[235px]
                    aspect-[235/225.5] lg:h-[225.5px]
                    rounded-[22px]
                    overflow-hidden
                    mx-auto sm:mt-3
                "
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ===== CONTENT ===== */}
            <div className="px-4 pt-3 lg:pt-[10px] pb-4 flex flex-col flex-1 gap-6 mb-6">

                <div>
                    <div className="flex items-center">
                        {/* Title */}
                        <h3 className="font-[Poppins] text-[18px] lg:text-[18px] me-1 font-medium text-[#080F20] leading-[20px] line-clamp-2">
                            {title}
                        </h3>
                        {/* IMPACTOR LOGO */}
                        {impactor && <img src="https://cdn.cness.io/impactor-logo.png" className="w-[24px] h-[24px]" alt="" />}
                    </div>
                    <p className="font-['open_sans'] text-[12px] leading-[18px] text-[#363842] line-clamp-3">
                        {description}
                    </p>
                </div>

                {/* Use the StarRating component */}
                <div className="flex items-center">
                    <StarRating rating={rating} />
                </div>
            </div>
        </div>
    );
}
