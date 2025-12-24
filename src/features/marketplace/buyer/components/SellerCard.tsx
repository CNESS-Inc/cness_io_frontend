import StarRating from "./Ui/StarRating";

/* ---------------- TYPES ---------------- */

interface SellerCardProps {
    title: string;
    description: string;
    rating: number;
    image: string;
    impactor?: boolean;
}


/* ---------------- COMPONENT ---------------- */

export default function SellerCard(props: SellerCardProps) {
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
                max-w-[122px] lg:w-[122px]
                overflow-hidden
                flex flex-col
            "
        >
            {/* ===== IMAGE ===== */}
            <div
                className="
                relative
                w-full lg:w-[122px]
                aspect-[122/117] lg:h-[117px]
                rounded-[12px]
                overflow-hidden
                mx-auto
                mt-3 lg:mt-[10px]
                "
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ===== CONTENT ===== */}
            <div className="flex flex-col flex-1 gap-3 mt-2 lg:mt-3">

                <div className="flex items-center justify-center">
                    {/* Title */}
                    <h3 className="font-[Poppins] text-[14px] lg:text-[16px] text-center me-1 font-medium text-[#080F20] leading-[20px] line-clamp-2">
                        {title}
                    </h3>
                    {/* IMPACTOR LOGO */}
                    {impactor && <img src="https://cdn.cness.io/impactor-logo.png" className="w-[14px] h-[14px]" alt="" />}
                </div>

                {/* Rating or "New Curator" */}
                <div className="flex items-center justify-center min-h-[24px]">
                    {rating > 0 ? (
                        <StarRating rating={rating} />
                    ) : (
                        <span className="
                            inline-flex
                            items-center
                            justify-center
                            h-4
                            bg-[#F1F3FF]
                            text-black
                            text-[10px]
                            font-semibold
                            font-['Open_Sans']
                            rounded-sm
                            whitespace-nowrap
                            px-1.5
                            leading-4
                            tracking-[-0.03em]
                            text-center
                            capitalize
                        ">
                            New Curator
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="font-['open_sans'] text-[12px] text-center leading-[18px] text-[#363842]">
                    {description}
                </p>
            </div>
        </div>
    );
}