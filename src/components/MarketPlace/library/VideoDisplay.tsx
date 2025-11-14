import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsBookmarkFill } from "react-icons/bs";
import { LuGalleryVerticalEnd, LuImagePlus } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";

interface ProductHeaderProps {
    thumbnail: string;
    title: string;
    seller: {
        id: string
        shop_name: string;
        shop_logo: string;
    };
    rating: string;
    reviews: number;
    purchase: string;
    language?: string;
    duration?: string;
    mood: {
        name: string;
        icon: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    content: any;
    onSaveToCollection?: () => void;
}

const VideoDisplay: React.FC<ProductHeaderProps> = ({
    // thumbnail,
    title,
    seller,
    reviews,
    rating,
    purchase,
    duration,
    mood,
    category,
    content,
    onSaveToCollection
}) => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Breadcrumbs */}
            <div className="flex text-[14px] font-[Open_Sans] text-slate-500">
                <button onClick={() => navigate("/dashboard/library")} className="font-[poppins] hover:underline">Library</button>
                <span className="mt-1 mx-2"><IoIosArrowForward /></span>
                <span className="font-[Open_Sans]">{category?.name}</span>
                <span className="mt-1 mx-2"><IoIosArrowForward /></span>
                <span className="text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {title}
                </span>

            </div>

            {/* Heading row: title + creator + save button */}
            <div className="w-full h-[60px] flex items-start justify-between mt-3">
                <div>
                    <h1 className="text-[20px] font-[Poppins] font-semibold text-slate-900">Soft guitar moods Books</h1>
                    <div className="flex items-center gap-2 mt-1 text-[12px] text-slate-600">
                        <img
                            src={seller?.shop_logo || "https://via.placeholder.com/300"}
                            alt={title}
                            className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{seller?.shop_name}</span>
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#7077FE] text-white text-[10px]">✓</span>
                    </div>
                </div>
                <button
                    className="text-400 text-[#000000] hover:text-[#000000] font-[Open_Sans] flex items-center gap-3"
                    onClick={onSaveToCollection}
                >
                    Save to Collections
                    <BsBookmarkFill color="#7C3AED" size={16} />
                </button>
            </div>

            {/* Top Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-600 mt-3">
                <span className="flex items-center">
                    <span className="mr-1 font-semibold">{mood?.icon} {mood?.name}</span>
                    <span className="mx-2">•</span>
                </span>
                <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                    <svg className="w-4 h-4 text-[#7077fe] mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09L5.8 12.02.924 7.91l6.068-.936L10 2l2.919 4.974 6.067.936-4.876 4.11 1.678 6.07z" />
                    </svg>
                    {rating} ({reviews} reviews)
                    <span className="mx-2">•</span>
                </span>
                <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                    <LuImagePlus className="w-4 h-4 text-[#7077fe] mr-1" />
                    21 purchases
                    <span className="mx-2">•</span>
                </span>
                <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                    <LuGalleryVerticalEnd className="w-4 h-4 text-[#7077fe] mr-1" />
                    {content?.length} Chapters
                    <span className="mx-2">•</span>
                </span>
                <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                    <FiCalendar className="w-4 h-4 text-[#7077fe] mr-1" />
                    Purchased on
                    <span className="font-semibold ml-1">
                        {new Date(purchase).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </span>
            </div>

            {/* Title Row */}
            <div className="grid items-center grid-cols-2 justify-between mt-3">


            </div>

            {/* Hero: only image/video, not split */}
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                <div className="w-full h-[340px] bg-cover bg-center relative" style={{ backgroundImage: "url('https://cdn.cness.io/video.svg')" }}>
                    <div className="absolute inset-0 bg-black/10" />
                    <button className="absolute left-4 bottom-4 bg-white/80 text-slate-700 text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                        00:19 / {duration}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoDisplay;