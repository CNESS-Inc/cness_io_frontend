import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsBookmarkFill } from "react-icons/bs";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    CheckCircle,
} from "lucide-react";
import { GenerateSignedUrl, TrackProgressProduct, MarkAsComplete } from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";

interface MusicDisplayProps {
    thumbnail: string;
    title: string;
    seller: {
        id: string;
        shop_name: string;
        shop_logo: string;
    };
    rating: string;
    reviews: number;
    purchase: string;
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
    currentFile: any;
    currentContent: any;
    productId: string;
    productProgress?: any;
    onTrackEnd?: () => void;
    onProgressUpdate?: () => void;
    onSaveToCollection?: () => void;
}

const MusicDisplay: React.FC<MusicDisplayProps> = ({
    thumbnail,
    title,
    seller,
    reviews,
    rating,
    purchase,
    mood,
    category,
    content,
    currentFile,
    currentContent,
    productId,
    productProgress,
    onTrackEnd,
    onProgressUpdate,
    onSaveToCollection,
}) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [lastProgressUpdate, setLastProgressUpdate] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [hasLoadedInitialPosition, setHasLoadedInitialPosition] = useState(false);
console.log('productProgress', productProgress)

    // Get current file's progress data
    const getCurrentFileProgress = () => {
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

        console.log("Current file progress:", fileProgress);
    }, [currentFile, productProgress]);

    // Reset and load new track
    useEffect(() => {
        if (currentFile?.file_url) {
            console.log("Loading new track:", currentFile.title);
            setIsPlaying(false);
            setDuration(0);
            setAudioUrl("");
            setHasLoadedInitialPosition(false);
            fetchSignedUrl();
        }
    }, [currentFile?.file_id]);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const updateDuration = () => {
            const audioDuration = audio.duration;
            setDuration(audioDuration);

            // Load saved progress when metadata loads
            const fileProgress = getCurrentFileProgress();
            console.log('fileProgress in updateDuration', fileProgress);

            if (fileProgress && audioDuration > 0 && !hasLoadedInitialPosition) {
                const savedPosition = fileProgress.current_position || 0;

                // Only resume if not completed and has valid saved position
                if (!fileProgress.is_completed && savedPosition > 0 && savedPosition < audioDuration) {
                    console.log(`Setting audio position to ${savedPosition}s (${fileProgress.progress_percentage}%)`);
                    audio.currentTime = savedPosition;
                    setCurrentTime(savedPosition);
                } else {
                    console.log("Starting from beginning");
                    audio.currentTime = 0;
                    setCurrentTime(0);
                }
                setHasLoadedInitialPosition(true);
            } else if (!fileProgress && audioDuration > 0 && !hasLoadedInitialPosition) {
                // No saved progress, start from beginning
                console.log("No saved progress found, starting from 0");
                audio.currentTime = 0;
                setCurrentTime(0);
                setHasLoadedInitialPosition(true);
            }
        };

        const handleEnded = () => {
            console.log("Track ended");
            setIsPlaying(false);
            handleTrackComplete();
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioUrl, productProgress, hasLoadedInitialPosition]);

    // Auto-save progress every 5 seconds while playing
    useEffect(() => {
        if (isPlaying && currentTime > 0 && duration > 0) {
            const timeSinceLastUpdate = currentTime - lastProgressUpdate;
            if (timeSinceLastUpdate >= 5) {
                console.log("Auto-saving progress at", Math.floor(currentTime), "seconds");
                trackProgress();
                setLastProgressUpdate(currentTime);
            }
        }
    }, [currentTime, isPlaying, lastProgressUpdate]);

    const fetchSignedUrl = async () => {
        setIsLoading(true);
        try {
            const response = await GenerateSignedUrl("audio", {
                product_id: productId,
                public_id: currentFile.file_url,
            });

            const url = response?.data?.data?.authenticated_url;
            if (url) {
                setAudioUrl(url);
                console.log("Signed URL fetched successfully");
            } else {
                showToast({
                    message: "Failed to load audio file",
                    type: "error",
                    duration: 3000,
                });
            }
        } catch (error: any) {
            console.error("Failed to fetch signed URL:", error);
            showToast({
                message: "Failed to load audio file",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const trackProgress = async () => {
        if (!currentFile?.file_id || duration === 0) {
            console.log("Cannot track progress: missing file_id or duration");
            return;
        }

        try {
            const progressPercentage = (currentTime / duration) * 100;
            const shouldComplete = progressPercentage >= 95;

            const payload = {
                product_id: productId,
                content_id: currentContent?.content_id || null,
                file_id: currentFile.file_id,
                current_position: Math.floor(currentTime),
                total_duration: Math.floor(duration),
                progress_percentage: Math.floor(progressPercentage),
                is_completed: shouldComplete,
                device_info: {
                    device: navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || "Unknown",
                    browser: navigator.userAgent.split(" ").slice(-2)[0] || "Unknown",
                    os: navigator.platform,
                },
            };

            console.log("Tracking progress:", payload);

            await TrackProgressProduct(payload);

            // Mark as complete if threshold reached
            if (shouldComplete && !isCompleted) {
                console.log("Track reached 95%, marking as complete");
                await markAsComplete();
            }

            // Refresh progress data from parent
            if (onProgressUpdate) {
                onProgressUpdate();
            }
        } catch (error) {
            console.error("Failed to track progress:", error);
        }
    };

    const handleTrackComplete = async () => {
        console.log("Handling track completion");
        await trackProgress();

        // Move to next track after a short delay
        setTimeout(() => {
            if (onTrackEnd) {
                onTrackEnd();
            }
        }, 1000);
    };

    const markAsComplete = async () => {
        try {
            const payload = {
                product_id: productId,
                content_id: currentContent?.content_id || null,
                file_id: currentFile?.file_id || null,
            };

            console.log("Marking as complete:", payload);

            await MarkAsComplete(payload);

            setIsCompleted(true);

            showToast({
                message: "Track completed! ✨",
                type: "success",
                duration: 2000,
            });

            // Refresh progress
            if (onProgressUpdate) {
                onProgressUpdate();
            }
        } catch (error) {
            console.error("Failed to mark as complete:", error);
        }
    };

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;

        if (isPlaying) {
            console.log("Pausing and saving progress");
            audio.pause();
            trackProgress(); // Save when pausing
        } else {
            console.log("Playing");
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = parseFloat(e.target.value);
        console.log("Seeking to", newTime);
        audio.currentTime = newTime;
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
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const skip = (seconds: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="flex text-[14px] font-[Open_Sans] text-slate-500 mb-4">
                <button
                    onClick={() => navigate("/dashboard/library")}
                    className="font-[poppins] hover:underline"
                >
                    Library
                </button>
                <span className="mt-1 mx-2">
                    <IoIosArrowForward />
                </span>
                <span className="font-[Open_Sans]">{category?.name}</span>
                <span className="mt-1 mx-2">
                    <IoIosArrowForward />
                </span>
                <span className="text-slate-700 font-[Poppins]">
                    {title}
                </span>
            </div>

            {/* Music Player Section */}
            <div className="w-full border border-slate-200 rounded-xl p-6 bg-white shadow-sm mb-6">
                <div className="flex gap-6 items-start">
                    {/* Album Art */}
                    <div className="w-56 h-56 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                        <img
                            src={thumbnail || "https://cdn.cness.io/music-placeholder.svg"}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Player Controls and Info */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-[20px] font-[Poppins] font-semibold text-slate-900 mb-2">
                                    {currentFile?.title || title}
                                </h1>
                                <p className="text-sm text-slate-600 font-[Open_Sans] mb-3">
                                    {currentContent?.title}
                                </p>
                                <div className="flex items-center gap-2 text-[12px] text-slate-600">
                                    <img
                                        src={seller?.shop_logo || "https://via.placeholder.com/300"}
                                        alt={seller?.shop_name}
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <span>{seller?.shop_name}</span>
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#7077FE] text-white text-[10px]">
                                        ✓
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isCompleted && (
                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                                        <CheckCircle size={14} />
                                        Completed
                                    </span>
                                )}
                                <button
                                  onClick={onSaveToCollection}
                                    className="text-sm text-[#000000] hover:text-[#000000] font-[Open_Sans] flex items-center gap-2"
                                >
                                    Save to Collections
                                    <BsBookmarkFill color="#7C3AED" size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-[12px] text-slate-600 mb-4">
                            <span className="flex items-center font-[Poppins]">
                                {mood?.icon} {mood?.name}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center font-[Poppins]">
                                <svg className="w-4 h-4 text-[#7077fe] mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09L5.8 12.02.924 7.91l6.068-.936L10 2l2.919 4.974 6.067.936-4.876 4.11 1.678 6.07z" />
                                </svg>
                                {rating} ({reviews} reviews)
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center font-[Poppins]">
                                <LuGalleryVerticalEnd className="w-4 h-4 text-[#7077fe] mr-1" />
                                {content?.length} Tracks
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center font-[Poppins]">
                                <FiCalendar className="w-4 h-4 text-[#7077fe] mr-1" />
                                {new Date(purchase).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                disabled={!audioUrl}
                            />
                            <div className="flex justify-between text-xs text-slate-600 mt-2 font-[Open_Sans]">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6">
                            <button
                                className="text-slate-400 hover:text-slate-600 transition"
                                disabled
                            >
                                <Shuffle size={20} />
                            </button>
                            <button
                                onClick={() => skip(-10)}
                                className="text-slate-600 hover:text-slate-900 transition"
                                disabled={!audioUrl}
                            >
                                <SkipBack size={24} />
                            </button>
                            <button
                                onClick={togglePlayPause}
                                className="w-14 h-14 rounded-full bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!audioUrl || isLoading}
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                                ) : isPlaying ? (
                                    <Pause size={24} fill="white" />
                                ) : (
                                    <Play size={24} fill="white" />
                                )}
                            </button>
                            <button
                                onClick={() => skip(10)}
                                className="text-slate-600 hover:text-slate-900 transition"
                                disabled={!audioUrl}
                            >
                                <SkipForward size={24} />
                            </button>
                            <button
                                className="text-slate-400 hover:text-slate-600 transition"
                                disabled
                            >
                                <Repeat size={20} />
                            </button>
                        </div>

                        {/* Hidden Audio Element */}
                        {audioUrl && (
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                preload="metadata"
                                onError={() => {
                                    showToast({
                                        message: "Error loading audio file",
                                        type: "error",
                                        duration: 3000,
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicDisplay;