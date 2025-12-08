import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
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
  onLike: () => void;
  is_liked: any;
  allStories: { content: StoryContent[] }[];
  currentStoryIndex: number;
  currentContentIndex: number;
  onContentIndexChange: (index: number) => void;
  storyId?: string;
  userId?: string;
  onStoryChange?: () => void;
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
  storyId,
  userId,
  onStoryChange,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [liked, setLiked] = useState(false);
  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5000;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(duration);
  const [isStoryReady, setIsStoryReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  // Update video element when mute state changes
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
    setIsStoryReady(false); // Reset ready state

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
          setIsStoryReady(true); // Mark as ready when metadata is loaded
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
      // Move to next content in current user's stories
      onContentIndexChange(currentContentIndex + 1);
    } else {
      // Move to next user
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
    isStoryReady, // Add this dependency
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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(is_liked);
    onLike();
  };

  const handleCloseComments = () => {
    setSelectedReelId(null);
    setIsPaused(false);
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
    // In your StoryViewer component, replace the main content section with this:

    <div className="relative w-full h-full bg-black">
      {/* Backdrop with previous and next story previews */}
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
                  muted={isMuted} // Use state instead of hardcoded muted
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

      {/* Side navigation arrows */}
      {/* {hasPrevious && (
        <Button
          onClick={onPrevious}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white backdrop-blur-lg border border-white/20 text-black hover:bg-white z-20"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </Button>
      )}

      {hasNext && (
        <Button
          onClick={onNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white backdrop-blur-lg border border-white/20 text-white hover:bg-white z-20"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </Button>
      )} */}

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
          <Button
            size="sm"
            className={`rounded-full ${
              is_liked ? "bg-[#79FE00] text-black" : "bg-[#7077FE]"
            } text-black border border-white hover:bg-[#79FE00] w-8 h-8 p-0 transition-all duration-300`}
            onClick={(e) => handleLikeClick(e)}
          >
            <img
              src={Like}
              className={`w-4 h-4 transition-transform duration-300 ${
                liked ? "transform scale-125" : ""
              }`}
              alt="Like"
            />
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-[#F07EFF] text-black border border-white hover:bg-white/90 w-8 h-8 p-0"
            onClick={(e) => handleCommentClick(e)}
          >
            <img src={comment} className="w-4 h-4" alt="Comment" />
          </Button>
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
        />
      )}
    </div>
  );
}
