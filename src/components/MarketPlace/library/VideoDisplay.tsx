import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    CheckCircle,
    Settings,
} from "lucide-react";
import { GenerateSignedUrl, TrackProgressProduct, MarkAsComplete } from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";

interface ProductHeaderProps {
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
    currentFile?: any;
    currentContent?: any;
    product_type_details?: any;
    productId?: string;
    productProgress?: any;
    isInCollections?: boolean;
    onVideoEnd?: () => void;
    onProgressUpdate?: () => void;
    onSaveToCollection?: () => void;
}

const VideoDisplay: React.FC<ProductHeaderProps> = ({
    thumbnail,
    title,
    seller,
    rating,
    purchase,
    duration,
    mood,
    category,
    content,
    currentFile,
    currentContent,
    productId,
    productProgress,
    product_type_details,
    isInCollections = false,
    onVideoEnd,
    onProgressUpdate,
    onSaveToCollection,
}) => {
    console.log('duration', duration)

    const navigate = useNavigate();
    const { showToast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const lastSaveTimeRef = useRef<number>(0); // Track last save time with ref to avoid stale closures
    const isSavingRef = useRef<boolean>(false); // Prevent concurrent saves
    const currentTimeRef = useRef<number>(0); // Store current time in ref to avoid stale closures in interval

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [hasLoadedInitialPosition, setHasLoadedInitialPosition] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);

    // Debug logging (only when data is missing)
    const isSingleVideo = !currentFile && product_type_details?.video_files;
    if (!isSingleVideo && (!currentFile || !currentContent)) {
        console.warn('⚠️ VideoDisplay missing data for chapter-based video:', {
            hasProductId: !!productId,
            hasCurrentFile: !!currentFile,
            hasCurrentContent: !!currentContent,
            productId,
            currentFile,
            currentContent
        });
    }

    // Get current file's progress data
    const getCurrentFileProgress = () => {
        const isSingleVideo = !currentFile && product_type_details?.video_files;

        // For single video products, return product-level progress
        if (isSingleVideo && productProgress) {
            return productProgress;
        }

        // For chapter-based videos, return file-level progress
        if (!currentFile?.file_id || !productProgress?.content_progress) {
            return null;
        }
        return productProgress.content_progress.find(
            (p: any) => p.file_id === currentFile.file_id
        );
    };

    // Check completion status whenever file or progress changes
    useEffect(() => {
        const fileProgress = getCurrentFileProgress();
        setIsCompleted(fileProgress?.is_completed || false);

        // Set initial currentTime from saved progress
        if (fileProgress && !hasLoadedInitialPosition) {
            const savedPosition = fileProgress.current_position || 0;
            if (!fileProgress.is_completed && savedPosition > 0) {
                setCurrentTime(savedPosition);
                console.log(`Initial position set to ${savedPosition}s from saved progress`);
            } else {
                setCurrentTime(0);
            }
        }

        console.log("Current progress:", fileProgress);
    }, [currentFile, productProgress, product_type_details]);

    // Reset and load new video
    useEffect(() => {
        // Handle both chapter-based videos and single video products
        const hasChapterVideo = currentFile?.file_url;
        const hasSingleVideo = product_type_details?.video_files;

        if (hasChapterVideo || hasSingleVideo) {
            console.log("Loading video:", currentFile?.title || title);

            // Save progress of previous video before switching
            if (currentTime > 0 && videoDuration > 0) {
                console.log("Saving progress before switching videos");
                trackProgress();
            }

            setIsPlaying(false);
            setVideoDuration(0);
            setVideoUrl("");
            setHasLoadedInitialPosition(false);
            fetchSignedUrl();
        }
    }, [currentFile?.file_id, product_type_details?.video_files]);

    // Handle video events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => {
            const time = video.currentTime;
            setCurrentTime(time);
            currentTimeRef.current = time; // Keep ref in sync
        };

        const updateDuration = () => {
            const duration = video.duration;
            setVideoDuration(duration);

            // Load saved progress when metadata loads
            const fileProgress = getCurrentFileProgress();
            console.log('fileProgress in updateDuration', fileProgress);

            if (fileProgress && duration > 0 && !hasLoadedInitialPosition) {
                const savedPosition = fileProgress.current_position || 0;

                // Only resume if not completed and has valid saved position
                if (!fileProgress.is_completed && savedPosition > 0 && savedPosition < duration) {
                    console.log(`Setting video position to ${savedPosition}s (${fileProgress.progress_percentage}%)`);
                    video.currentTime = savedPosition;
                    setCurrentTime(savedPosition);
                } else {
                    console.log("Starting from beginning");
                    video.currentTime = 0;
                    setCurrentTime(0);
                }
                setHasLoadedInitialPosition(true);
            } else if (!fileProgress && duration > 0 && !hasLoadedInitialPosition) {
                // No saved progress, start from beginning
                console.log("No saved progress found, starting from 0");
                video.currentTime = 0;
                setCurrentTime(0);
                setHasLoadedInitialPosition(true);
            }
        };

        const handleEnded = () => {
            console.log("Video ended");
            setIsPlaying(false);
            handleVideoComplete();
        };

        const handleError = (e: Event) => {
            console.error("Video error:", e);
            showToast({
                message: "Failed to load video. Please try again.",
                type: "error",
                duration: 3000,
            });
            setIsLoading(false);
        };

        const handleLoadStart = () => {
            console.log("Video loading started");
            setIsLoading(true);
        };

        const handleCanPlay = () => {
            console.log("Video can play");
            setIsLoading(false);
        };

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("ended", handleEnded);
        video.addEventListener("error", handleError);
        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("canplay", handleCanPlay);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("ended", handleEnded);
            video.removeEventListener("error", handleError);
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("canplay", handleCanPlay);
        };
    }, [videoUrl, productProgress, hasLoadedInitialPosition]);

    // Auto-save progress every 5 seconds while playing
    useEffect(() => {
        console.log("🔄 Auto-save effect triggered:", {
            isPlaying,
            videoDuration,
            currentTime: currentTimeRef.current
        });

        if (!isPlaying || videoDuration <= 0) {
            console.log("⏸️ Not setting up interval - video not playing or no duration");
            return;
        }

        console.log("⏱️ Setting up 5-second auto-save interval");

        // Set up interval to save every 5 seconds
        const interval = setInterval(() => {
            const time = currentTimeRef.current;
            console.log("⏰ 5-second interval fired:", {
                currentTime: Math.floor(time),
                isSaving: isSavingRef.current,
                lastSaveTime: Math.floor(lastSaveTimeRef.current)
            });

            if (!isSavingRef.current && time > 0) {
                console.log("✅ Starting auto-save at", Math.floor(time), "seconds");

                isSavingRef.current = true;
                lastSaveTimeRef.current = time;

                trackProgress().finally(() => {
                    console.log("✅ Auto-save completed at", Math.floor(time), "seconds");
                    isSavingRef.current = false;
                });
            } else {
                console.log("⏭️ Skipping save:", {
                    reason: isSavingRef.current ? "Already saving" : "Time is 0",
                    isSaving: isSavingRef.current,
                    time
                });
            }
        }, 5000); // Run every 5 seconds

        return () => {
            console.log("🛑 Clearing 5-second auto-save interval");
            clearInterval(interval);
        };
    }, [isPlaying, videoDuration]);

    // Save progress when user closes/refreshes the page
    useEffect(() => {
        const handleBeforeUnload = () => {
            const time = currentTimeRef.current;
            if (time > 0 && videoDuration > 0) {
                console.log("💾 Saving progress before page unload at", Math.floor(time), "seconds");
                trackProgress();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Also save progress when component unmounts (only run once)
            const time = currentTimeRef.current;
            if (time > 0 && videoDuration > 0) {
                console.log("💾 Saving progress on component unmount at", Math.floor(time), "seconds");
                trackProgress();
            }
        };
    }, [videoDuration]); // Only depend on videoDuration, NOT currentTime!

    // Hide controls after 3 seconds of inactivity
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setTimeout(() => {
            setShowControls(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [isPlaying, showControls]);

    const fetchSignedUrl = async () => {
        setIsLoading(true);
        try {
            // Debug: Log what values we have
            console.log("🔍 fetchSignedUrl - currentFile:", currentFile);
            console.log("🔍 fetchSignedUrl - product_type_details:", product_type_details);
            console.log("🔍 fetchSignedUrl - currentFile?.file_url:", currentFile?.file_url);
            console.log("🔍 fetchSignedUrl - product_type_details?.video_files:", product_type_details?.video_files);

            const videoFileId = currentFile?.file_url || product_type_details?.video_files;

            if (!videoFileId) {
                console.error("❌ No video file ID found");
                showToast({
                    message: "No video file found",
                    type: "error",
                    duration: 3000,
                });
                setIsLoading(false);
                return;
            }

            console.log("✅ Fetching signed URL for video ID:", videoFileId);

            const response = await GenerateSignedUrl("video", {
                product_id: productId,
                public_id: videoFileId,
            });

            // Extract URL from response - use MP4 for HTML5 video element compatibility
            const urls = response?.data?.data?.urls;
            const url = urls?.mp4; // Use MP4 as standard HTML5 video doesn't support HLS without hls.js

            console.log("Signed URL response:", {
                fullResponse: response?.data?.data,
                urls: urls,
                selectedUrl: url
            });

            if (url) {
                setVideoUrl(url);
                console.log("✅ Signed URL fetched successfully:", {
                    format: 'MP4',
                    videoId: response?.data?.data?.videoId,
                    url: url
                });
            } else {
                console.error("❌ No video URL found in response:", response?.data?.data);
                showToast({
                    message: "Failed to load video file",
                    type: "error",
                    duration: 3000,
                });
            }
        } catch (error: any) {
            console.error("Failed to fetch signed URL:", error);
            showToast({
                message: "Failed to load video file",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const trackProgress = async (forceComplete = false) => {
        const startTime = Date.now();
        const isSingleVideo = !currentFile && product_type_details?.video_files;

        console.log("📡 [TRACK API] Starting track progress call:", {
            timestamp: new Date().toISOString(),
            isSingleVideo: isSingleVideo,
            hasFileId: !!currentFile?.file_id,
            fileId: currentFile?.file_id,
            hasDuration: videoDuration > 0,
            duration: videoDuration,
            hasProductId: !!productId,
            productId: productId,
            currentTime: currentTime,
            forceComplete: forceComplete
        });

        // For single video products, we don't need file_id
        if (videoDuration === 0 || !productId) {
            console.error("❌ [TRACK API] Cannot track progress - Missing required data:", {
                videoDuration: videoDuration || "MISSING/ZERO",
                productId: productId || "MISSING"
            });
            return;
        }

        // For chapter-based videos, we need file_id
        if (!isSingleVideo && !currentFile?.file_id) {
            console.error("❌ [TRACK API] Cannot track progress - Missing file_id for chapter-based video:", {
                currentFile_file_id: currentFile?.file_id || "MISSING"
            });
            return;
        }

        try {
            const progressPercentage = forceComplete ? 100 : (currentTime / videoDuration) * 100;
            const shouldComplete = forceComplete || progressPercentage >= 95;

            const payload = {
                product_id: productId,
                current_position: forceComplete ? Math.floor(videoDuration) : Math.floor(currentTime),
                total_duration: Math.floor(videoDuration),
                progress_percentage: Math.floor(progressPercentage),
                is_completed: shouldComplete,
                device_info: {
                    device: navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || "Unknown",
                    browser: navigator.userAgent.split(" ").slice(-2)[0] || "Unknown",
                    os: navigator.platform,
                },
            };

            console.log("📤 [TRACK API] Sending payload:", payload);

            await TrackProgressProduct(payload);

            const endTime = Date.now();
            console.log("✅ [TRACK API] Success! Duration:", endTime - startTime, "ms");

            // Mark as complete if threshold reached
            if (shouldComplete && !isCompleted) {
                console.log("Video reached completion threshold, marking as complete");
                await markAsComplete();
            }

            // Refresh progress data from parent
            if (onProgressUpdate) {
                onProgressUpdate();
            }
        } catch (error: any) {
            const endTime = Date.now();
            console.error("❌ [TRACK API] Failed! Duration:", endTime - startTime, "ms");
            console.error("❌ [TRACK API] Error details:", error);

            showToast({
                message: error?.response?.data?.error?.message || "Failed to save progress",
                type: "error",
                duration: 3000,
            });
        }
    };

    const handleVideoComplete = async () => {
        console.log("Handling video completion - forcing 100% progress");

        // Force 100% progress and completion when video naturally ends
        await trackProgress(true);

        // Move to next video after a short delay
        setTimeout(() => {
            if (onVideoEnd) {
                onVideoEnd();
            }
        }, 1000);
    };

    const markAsComplete = async () => {
        const isSingleVideo = !currentFile && product_type_details?.video_files;

        // For single video products, we only need productId
        // For chapter-based videos, we need both productId and file_id
        if (!productId || (!isSingleVideo && !currentFile?.file_id)) return;

        try {
            const payload = {
                product_id: productId,
            };

            console.log("Marking as complete:", payload);

            const response = await MarkAsComplete(payload);

            // Verify completion was successful
            if (response?.success || response?.data?.success) {
                setIsCompleted(true);

                showToast({
                    message: "Video completed! ✨",
                    type: "success",
                    duration: 2000,
                });

                // Refresh progress
                if (onProgressUpdate) {
                    onProgressUpdate();
                }
            } else {
                throw new Error("Completion response invalid");
            }
        } catch (error: any) {
            console.error("Failed to mark as complete:", error);

            showToast({
                message: error?.response?.data?.error?.message || "Failed to mark video as complete",
                type: "error",
                duration: 3000,
            });

            // Retry once after 2 seconds
            setTimeout(async () => {
                console.log("Retrying mark as complete...");
                try {
                    const payload = {
                        product_id: productId,
                    };
                    const retryResponse = await MarkAsComplete(payload);

                    if (retryResponse?.success || retryResponse?.data?.success) {
                        setIsCompleted(true);
                        if (onProgressUpdate) {
                            onProgressUpdate();
                        }
                        showToast({
                            message: "Video completed! ✨",
                            type: "success",
                            duration: 2000,
                        });
                    }
                } catch (retryError) {
                    console.error("Retry failed:", retryError);
                }
            }, 2000);
        }
    };

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        if (isPlaying) {
            console.log("⏸️ User paused video - saving progress");
            video.pause();

            // Only save if not currently saving
            if (!isSavingRef.current) {
                console.log("💾 Saving progress on pause at", Math.floor(currentTime), "seconds");
                isSavingRef.current = true;
                trackProgress().finally(() => {
                    console.log("✅ Pause save completed");
                    isSavingRef.current = false;
                });
                lastSaveTimeRef.current = currentTime;
            } else {
                console.log("⏭️ Skipping pause save - already saving");
            }
        } else {
            console.log("▶️ User playing video");
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newTime = parseFloat(e.target.value);
        console.log("Seeking to", newTime);
        video.currentTime = newTime;
        setCurrentTime(newTime);

        // Save progress after seeking (debounced)
        setTimeout(() => {
            if (!isPlaying) {
                console.log("Saving progress after seek");
                trackProgress();
            }
        }, 1000);
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "00:00";
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            video.volume = volume;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = parseFloat(e.target.value);
        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleFullscreen = () => {
        const container = playerContainerRef.current;
        if (!container) return;

        if (!isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const changePlaybackRate = (rate: number) => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSpeedMenu(false);
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

            {/* Video Player Section */}
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

                {/* Video Info */}
                <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4">
                    <span className="flex items-center">
                        <span className="mr-1 font-semibold">{mood?.icon} {mood?.name}</span>
                        <span className="mx-2">•</span>
                    </span>
                    <span className="flex items-center font-[Poppins]">
                        <svg className="w-4 h-4 text-[#7077fe] mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09L5.8 12.02.924 7.91l6.068-.936L10 2l2.919 4.974 6.067.936-4.876 4.11 1.678 6.07z" />
                        </svg>
                        {rating?.average || '0.0'} ({rating?.total_reviews || 0} reviews)
                        <span className="mx-2">•</span>
                    </span>
                    <span className="flex items-center font-[Poppins]">
                        <LuGalleryVerticalEnd className="w-4 h-4 text-[#7077fe] mr-1" />
                        {content?.length} Chapters
                        <span className="mx-2">•</span>
                    </span>
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
                </div>

                {/* Video Player */}
                <div
                    ref={playerContainerRef}
                    className="relative w-full bg-black rounded-xl overflow-hidden border border-slate-200"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseMove={() => setShowControls(true)}
                    onMouseLeave={() => isPlaying && setShowControls(false)}
                >
                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        poster={thumbnail}
                        className="w-full aspect-video object-contain bg-black"
                        onClick={togglePlayPause}
                        crossOrigin="anonymous"
                        playsInline
                        preload="metadata"
                    />

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Completion Badge */}
                    {isCompleted && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium">
                            <CheckCircle size={16} />
                            Completed
                        </div>
                    )}

                    {/* Controls Overlay */}
                    {showControls && videoUrl && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                            {/* Progress Bar */}
                            <div className="mb-3">
                                <input
                                    type="range"
                                    min="0"
                                    max={videoDuration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                    style={{
                                        background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${(currentTime / videoDuration) * 100}%, #4B5563 ${(currentTime / videoDuration) * 100}%, #4B5563 100%)`
                                    }}
                                />
                                <div className="flex justify-between text-white text-xs mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(videoDuration)}</span>
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlayPause}
                                        className="text-white hover:text-violet-400 transition"
                                    >
                                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                    </button>

                                    {/* Volume */}
                                    <div className="flex items-center gap-2 group">
                                        <button
                                            onClick={toggleMute}
                                            className="text-white hover:text-violet-400 transition"
                                        >
                                            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="w-0 group-hover:w-20 transition-all duration-200 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Playback Speed */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                            className="text-white hover:text-violet-400 transition flex items-center gap-1 text-sm"
                                        >
                                            <Settings size={20} />
                                            {playbackRate}x
                                        </button>
                                        {showSpeedMenu && (
                                            <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                                    <button
                                                        key={rate}
                                                        onClick={() => changePlaybackRate(rate)}
                                                        className={`block w-full px-4 py-2 text-sm text-white hover:bg-violet-600 transition ${
                                                            playbackRate === rate ? 'bg-violet-500' : ''
                                                        }`}
                                                    >
                                                        {rate}x
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Fullscreen */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-violet-400 transition"
                                    >
                                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Center Play Button (when paused) */}
                    {!isPlaying && !isLoading && videoUrl && (
                        <button
                            onClick={togglePlayPause}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition group"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition">
                                <Play size={40} className="text-violet-600 ml-1" />
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoDisplay;
