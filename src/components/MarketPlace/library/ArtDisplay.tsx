import React, { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, X } from "lucide-react";
import { GenerateSignedUrl } from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";

interface ArtDisplayProps {
    thumbnail: string;
    title: string;
    seller: {
        id: string;
        shop_name: string;
        shop_logo: string;
    };
    rating: {
        average: string;
        total_reviews: number;
    };
    purchase: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    content: any[];
    currentFile?: any;
    currentContent?: any;
    productId?: string;
    isInCollections?: boolean;
    onSaveToCollection?: () => void;
    onImageSelect?: (file: any, content: any) => void;
    artsDetails?: {
        theme?: string;
        mediums?: string[];
        modern_trends?: string[];
    };
}

const ArtDisplay: React.FC<ArtDisplayProps> = ({
    thumbnail,
    title,
    seller,
    rating,
    purchase,
    category,
    content,
    currentFile,
    productId,
    isInCollections = false,
    onSaveToCollection,
    onImageSelect,
    artsDetails,
}) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // Flatten all images from all content collections with full file and content references
    const allImagesData = content?.flatMap(contentItem =>
        contentItem.files?.map((file: any) => ({
            file: file,
            content: contentItem
        }))
    ) || [];

    // Get current image title
    const currentImageTitle = currentFile?.title || title;

    // Fetch signed URL when currentFile changes (from sidebar click)
    useEffect(() => {
        const fileIdentifier = currentFile?.file_url || currentFile?.public_id;

        if (fileIdentifier) {
            console.log("🖼️ Loading new artwork:", currentFile?.title);
            console.log("🖼️ File identifier:", fileIdentifier);
            fetchSignedUrl(fileIdentifier);
        } else {
            console.warn("⚠️ No file_url or public_id found for current file:", currentFile);
            // Fallback to thumbnail
            setImageUrl(thumbnail);
        }
    }, [currentFile?.file_id, currentFile?.public_id]);

    const fetchSignedUrl = async (fileIdentifier: string) => {
        setIsLoading(true);
        try {
            console.log("🖼️ Fetching signed URL for image:", fileIdentifier);

            const response = await GenerateSignedUrl("image", {
                product_id: productId,
                public_id: fileIdentifier,
            });

            console.log("🖼️ Signed URL response:", response?.data?.data);

            // Extract URL from response - check for image URLs
            const urls = response?.data?.data?.urls;
            const url = urls?.jpg || urls?.png || urls?.webp || response?.data?.data?.authenticated_url || response?.data?.data?.secure_url;

            console.log("🖼️ Image URL extracted:", url);

            if (url) {
                setImageUrl(url);
                console.log("✅ Image signed URL fetched successfully");
            } else {
                console.error("❌ No image URL found in response");
                showToast({
                    message: "Failed to load image file",
                    type: "error",
                    duration: 3000,
                });
                // Fallback to thumbnail
                setImageUrl(thumbnail);
            }
        } catch (error: any) {
            console.error("Failed to fetch signed URL:", error);
            showToast({
                message: "Failed to load image file",
                type: "error",
                duration: 3000,
            });
            // Fallback to thumbnail
            setImageUrl(thumbnail);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviousImage = () => {
        if (!onImageSelect || allImagesData.length === 0) return;

        // Find current file index
        const currentIndex = allImagesData.findIndex(
            item => item.file.file_id === currentFile?.file_id
        );

        // Calculate previous index (wrap around)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : allImagesData.length - 1;
        const prevImageData = allImagesData[prevIndex];

        // Call parent to update currentFile
        onImageSelect(prevImageData.file, prevImageData.content);
        setZoomLevel(1);
    };

    const handleNextImage = () => {
        if (!onImageSelect || allImagesData.length === 0) return;

        // Find current file index
        const currentIndex = allImagesData.findIndex(
            item => item.file.file_id === currentFile?.file_id
        );

        // Calculate next index (wrap around)
        const nextIndex = currentIndex < allImagesData.length - 1 ? currentIndex + 1 : 0;
        const nextImageData = allImagesData[nextIndex];

        // Call parent to update currentFile
        onImageSelect(nextImageData.file, nextImageData.content);
        setZoomLevel(1);
    };

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setZoomLevel(1);
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentImageTitle || 'artwork.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
            showToast({
                message: "Failed to download image",
                type: "error",
                duration: 3000,
            });
        }
    };

    return (
        <div>
            {/* Breadcrumbs */}
            <div className="flex text-[14px] font-[Open_Sans] text-slate-500 mb-4">
                <button onClick={() => navigate("/dashboard/library")} className="font-[poppins] hover:underline">
                    Library
                </button>
                <span className="mt-1 mx-2"><IoIosArrowForward /></span>
                <span className="font-[Open_Sans]">{category?.name}</span>
                <span className="mt-1 mx-2"><IoIosArrowForward /></span>
                <span className="text-slate-700 font-[Poppins]">
                    {title}
                </span>
            </div>

            {/* Art Viewer Section */}
            <div className="w-full">
                {/* Header */}
                <div className="w-full flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-[20px] font-[Poppins] font-semibold text-slate-900">{title}</h1>
                        <div className="flex items-center gap-2 mt-1 text-[12px] text-slate-600">
                            <img
                                src={seller?.shop_logo || "https://cdn.cness.io/default-avatar.svg"}
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
                        {isInCollections ? "Saved to Collections" : "Save to Collections"}
                        {isInCollections ? (
                            <BsBookmarkFill color="#7C3AED" size={16} />
                        ) : (
                            <BsBookmark color="#7C3AED" size={16} />
                        )}
                    </button>
                </div>

                {/* Art Info */}
                <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4">
                    {artsDetails?.theme && (
                        <>
                            <span className="flex items-center font-[Poppins]">
                                <span className="mr-1 font-semibold">Theme: {artsDetails.theme}</span>
                                <span className="mx-2">•</span>
                            </span>
                        </>
                    )}
                    <span className="flex items-center font-[Poppins]">
                        <svg className="w-4 h-4 text-[#7077fe] mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09L5.8 12.02.924 7.91l6.068-.936L10 2l2.919 4.974 6.067.936-4.876 4.11 1.678 6.07z" />
                        </svg>
                        {rating?.average || '0.0'} ({rating?.total_reviews || 0} reviews)
                        <span className="mx-2">•</span>
                    </span>
                    <span className="flex items-center font-[Poppins]">
                        <svg className="w-4 h-4 text-[#7077fe] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {allImagesData.length} Artworks
                        <span className="mx-2">•</span>
                    </span>
                    {purchase && (
                        <span className="flex items-center font-[Poppins]">
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
                    )}
                </div>

                {/* Art Viewer */}
                <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-slate-200">
                    <div className="relative w-full aspect-video flex items-center justify-center p-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <img
                                src={imageUrl || thumbnail}
                                alt={currentImageTitle}
                                className="max-w-full max-h-full object-contain cursor-zoom-in rounded-lg shadow-lg transition-transform duration-200"
                                style={{ transform: `scale(${zoomLevel})` }}
                                onClick={toggleFullscreen}
                            />
                        )}

                        {/* Navigation Controls */}
                        {allImagesData.length > 1 && (
                            <>
                                <button
                                    onClick={handlePreviousImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Zoom & Download Controls */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                                onClick={handleZoomOut}
                                disabled={zoomLevel <= 0.5}
                                className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition disabled:opacity-50"
                            >
                                <ZoomOut size={20} />
                            </button>
                            <button
                                onClick={handleZoomIn}
                                disabled={zoomLevel >= 3}
                                className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition disabled:opacity-50"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition"
                            >
                                <Download size={20} />
                            </button>
                        </div>

                        {/* Image Counter */}
                        {allImagesData.length > 1 && (
                            <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-800 shadow-lg">
                                {allImagesData.findIndex(item => item.file.file_id === currentFile?.file_id) + 1} / {allImagesData.length}
                            </div>
                        )}
                    </div>

                    {/* Image Title */}
                    <div className="bg-white px-6 py-3 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900">{currentImageTitle}</h3>
                        {allImagesData.find(item => item.file.file_id === currentFile?.file_id)?.content?.title && (
                            <p className="text-sm text-gray-600 mt-1">
                                From: {allImagesData.find(item => item.file.file_id === currentFile?.file_id)?.content?.title}
                            </p>
                        )}
                    </div>
                </div>

                {/* Mediums & Trends */}
                {(artsDetails?.mediums || artsDetails?.modern_trends) && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {artsDetails?.mediums && artsDetails.mediums.length > 0 && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-2">Mediums</h4>
                                <div className="flex flex-wrap gap-2">
                                    {artsDetails.mediums.map((medium: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                        >
                                            {medium}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {artsDetails?.modern_trends && artsDetails.modern_trends.length > 0 && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-2">Modern Trends</h4>
                                <div className="flex flex-wrap gap-2">
                                    {artsDetails.modern_trends.map((trend: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                                        >
                                            {trend}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    <button
                        onClick={toggleFullscreen}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"
                    >
                        <X size={24} />
                    </button>

                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <img
                            src={imageUrl || thumbnail}
                            alt={currentImageTitle}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            style={{ transform: `scale(${zoomLevel})` }}
                        />
                    )}

                    {/* Fullscreen Controls */}
                    {allImagesData.length > 1 && (
                        <>
                            <button
                                onClick={handlePreviousImage}
                                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                        <button
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 0.5}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition disabled:opacity-50"
                        >
                            <ZoomOut size={24} />
                        </button>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 3}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition disabled:opacity-50"
                        >
                            <ZoomIn size={24} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
                        >
                            <Download size={24} />
                        </button>
                    </div>

                    {allImagesData.length > 1 && (
                        <div className="absolute bottom-8 right-8 bg-white/10 px-4 py-2 rounded-full text-white font-medium">
                            {allImagesData.findIndex(item => item.file.file_id === currentFile?.file_id) + 1} / {allImagesData.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArtDisplay;
