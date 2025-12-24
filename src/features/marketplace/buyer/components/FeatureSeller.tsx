import StarRating from "./Ui/StarRating";

export default function FeatureSeller({
  title,
  description,
  image,
  impactor,
  rating,
}: any) {
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
          aspect-[4/3] sm:aspect-[341/327]
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
        <div className="flex flex-col justify-center flex-1 min-w-0 py-[6px]">
          <div className="space-y-[12px]">
            <h3 className="font-[Poppins] text-[18px] sm:text-[18px] font-medium text-[#363842] leading-[24px]">
              {title}
            </h3>

            <p className="font-['open_sans'] text-[12px] leading-[18px] text-[#363842] line-clamp-3">
              {description}
            </p>

            {/* Use the StarRating component */}
            <div className="flex items-center">
              <StarRating rating={rating} />
            </div>
          </div>
        </div>
        
        {/* IMPACTOR */}
        <div className="pt-[10px] mt-auto">
          {impactor && (
            <div className="flex items-center text-[13px]">
              <img
                src={"https://cdn.cness.io/impactor.png"}
                alt={title}
                className="w-[80px] h-[24px] object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}