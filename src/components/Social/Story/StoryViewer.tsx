import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import Button from "../../ui/Button";
import { Input } from "../../ui/input";
import Like from "../../../assets/story-like.png";
import comment from "../../../assets/story-comment.png";
import share from "../../../assets/story-share.png";
import ReelComment from "../Reels/ReelComment";
import SharePopup from "../SharePopup";
import moment from "moment";

interface StoryContent {
  id: string;
  type: "image" | "video";
  url: string;
  duration: number;
}

interface StoryViewerProps {
  stories: StoryContent[];
  userName: string;
  userAvatar?: string;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  timeAgo: any;
  allStories: { content: StoryContent[] }[];
  currentStoryIndex: number;
  currentContentIndex: number;
  comments_count: number; // Add this
  onContentIndexChange: (index: number) => void;
  userId?: string;
  onStoryChange?: () => void;
  onLike: () => void;
  is_liked: boolean;
  likes_count: number;
  storyId?: string;
  onRegisterAnimation?: (callback: (amount?: number) => void) => void;
  onCommentCountUpdate?: (newCount: number) => void;
}

interface TimeAgoProps {
  date: string | Date;
}

moment.updateLocale("en-short", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "few sec",
    ss: "%ds",
    m: "1 min",
    mm: "%d min",
    h: "1 hr",
    hh: "%d hrs",
    d: "1 day",
    dd: "%d days",
    M: "1 mon",
    MM: "%d mon",
    y: "1 yr",
    yy: "%d yrs",
  },
});

const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  const updateTime = () => {
    setTimeAgo(moment(date).locale("en-short").fromNow());
  };

  useEffect(() => {
    updateTime(); // initial render
    const interval = setInterval(updateTime, 60 * 1000); // update every 1 min
    return () => clearInterval(interval); // cleanup
  }, [date]);

  return <span>{timeAgo}</span>;
};

export function StoryViewer({
  allStories,
  currentStoryIndex,
  currentContentIndex,
  onContentIndexChange,
  stories,
  userName,
  userAvatar,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  timeAgo,
  onLike,
  is_liked,
  likes_count,
  comments_count, // Add this prop
  onRegisterAnimation,
  onCommentCountUpdate,
  storyId,
  userId,
  onStoryChange,
}: StoryViewerProps) {
  console.log("🚀 ~ StoryViewer ~ comments_count:", comments_count)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5000;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(duration);
  const [isStoryReady, setIsStoryReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (onRegisterAnimation) {
      const animationCallback = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      };
      
      onRegisterAnimation(animationCallback);
    }
  }, [onRegisterAnimation]);

  const prevStory = hasPrevious
    ? allStories[currentStoryIndex - 1]?.content?.[0]
    : null;
  const nextStory = hasNext
    ? allStories[currentStoryIndex + 1]?.content?.[0]
    : null;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, currentStory]);

  // Reset everything when stories change
  useEffect(() => {
    console.log("🔄 Resetting story viewer state");
    setCurrentIndex(0);
    setProgress(0);
    setIsPaused(false);
    setSelectedReelId(null);
    setIsStoryReady(false); 

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset video if it exists
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [stories]);

  useEffect(() => {
    console.log("🔄 Content changed:", currentContentIndex);
    setProgress(0);
    setIsPaused(false);
    setIsStoryReady(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentContentIndex]);

  // Handle video metadata and set ready state
  useEffect(() => {
    if (currentStory?.type === "video" && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedMetadata = () => {
        console.log("🎬 Video metadata loaded");
        if (videoRef.current) {
          const duration =
            videoRef.current.duration * 1000 || currentStory.duration;
          setVideoDuration(duration);
          setIsStoryReady(true); 
        }
      };

      const handleCanPlay = () => {
        console.log("🎬 Video can play");
        setIsStoryReady(true);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("canplay", handleCanPlay);
      };
    } else if (currentStory?.type === "image") {
      setIsStoryReady(true);
    }
  }, [currentStory]);

  const handleAutoAdvance = () => {
    console.log("⏭️ Auto advancing content");
    if (currentContentIndex < stories.length - 1) {
      onContentIndexChange(currentContentIndex + 1);
    } else {
      onNext();
    }
  };

  function startProgressInterval() {
    const effectiveDuration =
      currentStory.type === "video" ? videoDuration : duration;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleAutoAdvance();
          return 0;
        }
        const increment = 100 / (effectiveDuration / 100);
        const newProgress = Math.min(prev + increment, 100);
        return newProgress;
      });
    }, 100);
  }

  // Main progress effect - ONLY start when story is ready
  useEffect(() => {
    // Don't start progress if paused, comments open, no current story, or story not ready
    if (isPaused || selectedReelId || !currentStory || !isStoryReady) {
      console.log("⏸️ Progress paused - reasons:", {
        isPaused,
        selectedReelId,
        hasCurrentStory: !!currentStory,
        isStoryReady,
      });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    setProgress(0);

    // For videos, use the video element for progress
    if (currentStory.type === "video" && videoRef.current) {
      const video = videoRef.current;

      // Try to play the video
      video.play().catch((error) => {
        console.error("Video play error:", error);
        // Fallback to interval if video can't play
        startProgressInterval();
      });
    } else {
      // For images, use interval
      startProgressInterval();
    }

    return () => {
      if (intervalRef.current) {
        console.log("🧹 Cleaning up progress interval");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    currentIndex,
    stories.length,
    duration,
    videoDuration,
    onNext,
    isPaused,
    selectedReelId,
    currentStory,
    currentStory?.type,
    isStoryReady,
  ]);

  // Video time update handler
  useEffect(() => {
    if (currentStory?.type === "video" && videoRef.current && isStoryReady) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        if (video.duration) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          setProgress(currentProgress);

          // Auto-advance when video ends
          if (video.currentTime >= video.duration) {
            handleAutoAdvance();
          }
        }
      };

      const handleEnded = () => {
        console.log("🎬 Video ended, auto-advancing");
        handleAutoAdvance();
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);

      // Handle play/pause based on state
      if (isPaused || selectedReelId) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [isPaused, selectedReelId, currentStory, isStoryReady]);

  // Close comment box when story changes
  useEffect(() => {
    if (selectedReelId) {
      setSelectedReelId(null);
      setIsPaused(false);
    }
    if (onStoryChange) {
      onStoryChange();
    }
  }, [currentStory?.id, onStoryChange]);

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      console.log("⬅️ Moving to previous story in user's stories");
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setIsStoryReady(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    } else {
      console.log("⬅️ Moving to previous user");
      onPrevious();
    }
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      console.log("➡️ Moving to next story in user's stories");
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      setIsStoryReady(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    } else {
      console.log("➡️ Moving to next user");
      onNext();
    }
  };

  const handlePrevContent = () => {
    if (currentContentIndex > 0) {
      console.log("⬅️ Moving to previous content");
      onContentIndexChange(currentContentIndex - 1);
    } else {
      console.log("⬅️ Moving to previous user");
      onPrevious();
    }
  };

  const handleNextContent = () => {
    if (currentContentIndex < stories.length - 1) {
      console.log("➡️ Moving to next content");
      onContentIndexChange(currentContentIndex + 1);
    } else {
      console.log("➡️ Moving to next user");
      onNext();
    }
  };

  // Add debug logging
  useEffect(() => {
    console.log("📊 Story Viewer State:", {
      currentIndex,
      progress: Math.round(progress),
      storiesCount: stories.length,
      currentStoryId: currentStory?.id,
      currentStoryType: currentStory?.type,
      isPaused,
      selectedReelId,
      videoDuration,
      isStoryReady,
    });
  }, [
    currentIndex,
    progress,
    stories.length,
    currentStory,
    isPaused,
    selectedReelId,
    videoDuration,
    isStoryReady,
  ]);

  // Rest of your component remains the same...
  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(!isPaused);

    if (currentStory.type === "video" && videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    console.log("currentStory.id", currentStory);
    setSelectedReelId(currentStory.id);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger animation
    setIsAnimating(true);

    // Call the parent like handler
    onLike();

    // Reset animation after 1 second
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const animationStyles = `
    @keyframes heartPop {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
    }

    @keyframes pulseGlow {
      0% {
        box-shadow: 0 0 0 0 rgba(121, 254, 0, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(121, 254, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(121, 254, 0, 0);
      }
    }

    @keyframes likePulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.3);
      }
      100% {
        transform: scale(1);
      }
    }

    .like-button-animate {
      animation: likePulse 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .heart-pop-animation {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: heartPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
      z-index: 40;
    }

    .pulse-glow {
      animation: pulseGlow 1s ease-in-out;
    }

    .bg-pulse {
      animation: bgPulse 0.6s ease-out;
    }

    @keyframes bgPulse {
      0% {
        background-color: #79FE00;
      }
      100% {
        background-color: #79FE00;
      }
    }

    .bg-unlike-pulse {
      animation: bgUnlikePulse 0.6s ease-out;
    }

    @keyframes bgUnlikePulse {
      0% {
        background-color: #7077FE;
      }
      100% {
        background-color: #7077FE;
      }
    }
  `;

  const handleCloseComments = () => {
    setSelectedReelId(null);
    setIsPaused(false);
  };

  const updateCommentCount = (newCount: number) => {
    if (onCommentCountUpdate) {
      onCommentCountUpdate(newCount);
    }
  };

  const handleShare = () => {
    setShowSharePopup(!showSharePopup);
  };

  const buildStoryShareUrl = () => {
    if (storyId && userId) {
      return `${window.location.origin}/story-design?user=${userId}&story=${storyId}`;
    }
    return `${window.location.origin}/story-design`;
  };

  if (!currentStory) return null;

  return (
    <div className="relative w-full h-full bg-black">
      <style>{animationStyles}</style>

      {/* Floating heart animation */}
      {isAnimating && (
        <div className="heart-pop-animation">
          <Heart
            size={80}
            fill="#7077FE"
            color="#7077FE"
            className="drop-shadow-lg"
          />
        </div>
      )}

      <div className="absolute inset-0 flex justify-center items-center">
        {/* Previous story preview (left side) */}
        {hasPrevious && prevStory && (
          <div className="absolute hidden xl:block left-0 w-2/9 h-4/8 lg:w-2/9 lg:h-5/8 rounded-lg overflow-hidden z-0 ml-4">
            <div className="w-full h-full">
              <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)]"></div>
              {prevStory.type === "image" ? (
                <img
                  src={prevStory.url}
                  className="w-full h-full object-cover"
                  alt="Previous story"
                />
              ) : (
                <video
                  src={prevStory.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                />
              )}
            </div>
          </div>
        )}

        {/* Next story preview (right side) */}
        {hasNext && nextStory && (
          <div className="absolute hidden xl:block right-0 w-2/9 h-4/8 lg:w-2/9 lg:h-5/8 rounded-lg overflow-hidden z-0 mr-4">
            <div className="w-full h-full relative">
              <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)]"></div>
              {nextStory.type === "image" ? (
                <img
                  src={nextStory.url}
                  className="w-full h-full object-cover"
                  alt="Next story"
                />
              ) : (
                <video
                  src={nextStory.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                />
              )}
            </div>
          </div>
        )}

        {/* Current story (center) */}
        <div className="relative z-10 w-full max-w-md h-[80%] mx-4">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-30">
            {stories.map((_story, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: `${
                      index < currentContentIndex
                        ? 100
                        : index === currentContentIndex
                        ? progress
                        : 0
                    }%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Navigation areas */}
          <button
            onClick={handlePrevContent}
            className="absolute left-0 top-0 w-1/4 h-full z-10 focus:outline-none"
            disabled={!hasPrevious && currentContentIndex === 0}
          />
          <button
            onClick={handleNextContent}
            className="absolute right-0 top-0 w-1/4 h-full z-10 focus:outline-none"
            disabled={!hasNext && currentContentIndex === stories.length - 1}
          />

          {/* Story Content */}
          <div className="relative h-full w-full bg-black rounded-2xl overflow-hidden">
            {currentStory.type === "image" ? (
              <img
                src={currentStory.url}
                alt="Story content"
                className="w-full h-full object-cover"
                onClick={(e) => togglePause(e)}
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={currentStory.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={isMuted}
                  loop={false}
                  onClick={(e) => togglePause(e)}
                />
                {/* Mute/Unmute button */}
                <button
                  onClick={toggleMute}
                  className="absolute top-10 right-5 z-30 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX color="white" />
                  ) : (
                    <Volume2 color="white" />
                  )}
                </button>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
          </div>

          {/* User info */}
          <div className="absolute top-16 left-4 right-4 flex flex-col gap-1 z-30">
            <div className="flex items-center gap-3">
              <div className="relative w-[42px] h-[42px] rounded-full p-[1.83px] bg-linear-to-r from-[#6340FF] to-[#D748EA]">
                <div className="w-full h-full rounded-full overflow-hidden object-cover bg-white p-px">
                  <img
                    src={userAvatar ? userAvatar : "/profile.png"}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <span className="absolute bottom-[5px] right-2 w-2.5 h-2.5 rounded-full bg-green-500 border-[1.5px] border-white"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{userName}</span>
                <span className="text-white/70 text-sm">
                  <TimeAgo date={timeAgo ? timeAgo : new Date()} />
                </span>
              </div>
            </div>
          </div>

          {/* Pause/Play button */}
          <button
            onClick={(e) => togglePause(e)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            {isPaused ? (
              <Play className="w-12 h-12 text-white/80" />
            ) : (
              <Pause className="w-12 h-12 text-white/80" />
            )}
          </button>

          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-[-35px] 2xl:left-[-65px] -translate-x-1/2 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white backdrop-blur-lg border border-white/20 text-black hover:bg-white z-20"
            >
              <div className="w-full h-full flex justify-center items-center">
                <ChevronLeft className="w-6 h-6 text-black" />
              </div>
            </button>
          )}

          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-[-35px] 2xl:right-[-65px] top-1/2 translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white backdrop-blur-lg border border-white/20 text-white hover:bg-white z-20"
            >
              <div className="w-full h-full flex justify-center items-center">
                <ChevronRight className="w-6 h-6 text-black" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Navigation areas */}
      <button
        onClick={handlePrevStory}
        className="absolute left-0 top-0 w-1/4 h-full z-10 focus:outline-none"
        disabled={!hasPrevious && currentIndex === 0}
      />
      <button
        onClick={handleNextStory}
        className="absolute right-0 top-0 w-1/4 h-full z-10 focus:outline-none"
        disabled={!hasNext && currentIndex === stories.length - 1}
      />

      {/* Message input */}
      <div className="absolute bottom-4 w-3/8 mx-auto left-4 right-4 z-30">
        <div className="flex items-center gap-2 rounded-full p-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Reply..."
            className="flex-1 bg-white backdrop-blur-lg rounded-full border-none placeholder:text-black focus-visible:ring-0"
            onClick={(e) => handleCommentClick(e)}
          />
          
          {/* Like Button with Count */}
          <div className="relative">
            <Button
              size="sm"
              className={`
              rounded-full 
              ${is_liked ? "bg-[#7077FE]" : "bg-[#7077FE]"} 
              ${isAnimating && is_liked ? "pulse-glow like-button-animate" : ""}
              ${isAnimating && !is_liked ? "bg-unlike-pulse" : ""}
              text-black border border-white hover:bg-[#7077FE] 
              w-8 h-8 p-0 transition-all duration-300 relative
            `}
              onClick={(e) => handleLikeClick(e)}
              disabled={isAnimating}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {isAnimating && is_liked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart
                      size={20}
                      fill="white"
                      color="white"
                      className="animate-pulse"
                    />
                  </div>
                )}

                <img
                  src={Like}
                  className={`
                  w-4 h-4 transition-all duration-300 
                  ${is_liked ? "transform scale-110" : ""}
                  ${isAnimating ? "opacity-0" : "opacity-100"}
                `}
                  alt="Like"
                />
              </div>
            </Button>

            {/* Like count badge */}
            <div
              className={`
              absolute -top-2 -right-2 
              bg-white rounded-full 
              w-5 h-5 flex items-center justify-center 
              text-xs font-bold 
              transition-all duration-300
              ${
                likes_count > 0
                  ? "scale-100 opacity-100 text-[#7077FE]"
                  : "scale-0 opacity-0"
              }
            `}
            >
              {likes_count}
            </div>
          </div>

          {/* Comment Button with Count */}
          <div className="relative">
            <Button
              size="sm"
              className="rounded-full bg-[#F07EFF] text-black border border-white hover:bg-white/90 w-8 h-8 p-0"
              onClick={(e) => handleCommentClick(e)}
            >
              <img src={comment} className="w-4 h-4" alt="Comment" />
            </Button>

            {/* Comment count badge */}
            <div
              className={`
              absolute -top-2 -right-2 
              bg-white rounded-full 
              w-5 h-5 flex items-center justify-center 
              text-xs font-bold 
              transition-all duration-300
              ${
                comments_count > 0
                  ? "scale-100 opacity-100 text-[#F07EFF]"
                  : "scale-0 opacity-0"
              }
            `}
            >
              {comments_count}
            </div>
          </div>

          {/* Share Button */}
          <div className="relative">
            <Button
              size="sm"
              className="rounded-full bg-[#6ACFAD] text-black border border-white hover:bg-white/90 w-8 h-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              <img src={share} className="w-4 h-4" alt="Share" />
            </Button>
            {showSharePopup && (
              <SharePopup
                isOpen={showSharePopup}
                onClose={() => setShowSharePopup(false)}
                url={buildStoryShareUrl()}
                position="top"
              />
            )}
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {selectedReelId && (
        <ReelComment
          selectedReelId={selectedReelId}
          setSelectedReelId={handleCloseComments}
          onCommentCountUpdate={updateCommentCount}
        />
      )}
    </div>
  );
}