import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Button from "../../ui/Button";
import { Input } from "../../ui/input";
import Like from "../../../assets/story-like.png";
import comment from "../../../assets/story-comment.png";
import share from "../../../assets/story-share.png";
import ReelComment from "../Reels/ReelComment";
import SharePopup from "../SharePopup";

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
  timeAgo: string;
  onLike: () => void;
  is_liked: any;
  allStories: { content: StoryContent[] }[];
  currentStoryIndex: number;
  storyId?: string;
  userId?: string;
  onStoryChange?: () => void; // Callback when story changes
}

export function StoryViewer({
  allStories,
  currentStoryIndex,
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
  console.log("🚀 ~ StoryViewer ~ hasPrevious:", hasPrevious);
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

  const prevStory = hasPrevious
    ? allStories[currentStoryIndex - 1]?.content?.[0]
    : null;
  const nextStory = hasNext
    ? allStories[currentStoryIndex + 1]?.content?.[0]
    : null;

  useEffect(() => {
    if (currentStory.type === "video" && videoRef.current) {
      const handleLoadedMetadata = () => {
        if (videoRef.current) {
          setVideoDuration(videoRef.current.duration * 1000 || duration);
        }
      };

      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        videoRef.current?.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [currentStory, duration]);

  useEffect(() => {
    if (isPaused || selectedReelId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setProgress(0);
    const effectiveDuration =
      currentStory.type === "video" ? videoDuration : duration;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onNext();
            return 100;
          }
        }
        return prev + 100 / (effectiveDuration / 100);
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    currentIndex,
    stories.length,
    duration,
    videoDuration,
    onNext,
    isPaused,
    selectedReelId,
    currentStory.type,
  ]);

  useEffect(() => {
    if (currentStory?.type === "video" && videoRef.current) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        if (video.duration) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          setProgress(currentProgress);
        }
      };

      if (isPaused || selectedReelId) {
        video.pause();
      } else {
        video
          .play()
          .catch((error) => console.error("Video play error:", error));
      }

      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [isPaused, selectedReelId, currentStory]);

  // Close comment box when story changes
  useEffect(() => {
    if (selectedReelId) {
      setSelectedReelId(null);
      setIsPaused(false);
    }
    // Call the callback to notify parent component
    if (onStoryChange) {
      onStoryChange();
    }
  }, [currentStory?.id, onStoryChange]); // Close comments when current story changes

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        if (!isPaused) videoRef.current.play();
      }
    } else {
      onPrevious();
    }
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        if (!isPaused) videoRef.current.play();
      }
    } else {
      onNext();
    }
  };

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
    console.log('currentStory.id', currentStory);
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
      return `https://dev.cness.io/story-design?user=${userId}&story=${storyId}`;
    }
    return `https://dev.cness.io/story-design`;
  };

  if (!currentStory) return null;

  return (
    // In your StoryViewer component, replace the main content section with this:

    <div className="relative w-full h-full bg-[#000]">
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
                    width: `${index < currentIndex
                      ? 100
                      : index === currentIndex
                        ? progress
                        : 0
                      }%`,
                  }}
                />
              </div>
            ))}
          </div>

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
              <video
                ref={videoRef}
                src={currentStory.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop={false}
                onClick={(e) => togglePause(e)}
              />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>

          {/* User info */}
          <div className="absolute top-16 left-4 right-4 flex flex-col gap-1 z-30">
            <div className="flex items-center gap-3">
              <div className="relative w-[42px] h-[42px] rounded-full p-[1.83px] bg-gradient-to-r from-[#6340FF] to-[#D748EA]">
                <div className="w-full h-full rounded-full overflow-hidden object-cover bg-white p-[1px]">
                  <img
                    src={userAvatar}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <span className="absolute bottom-[5px] right-[8px] w-[10px] h-[10px] rounded-full bg-green-500 border-[1.5px] border-white"></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{userName}</span>
                <span className="text-white/70 text-sm">{timeAgo}</span>
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
            className={`rounded-full ${is_liked ? "bg-[#79FE00] text-black" : "bg-[#7077FE]"
              } text-black border-1 border-white hover:bg-[#79FE00] w-8 h-8 p-0 transition-all duration-300`}
            onClick={(e) => handleLikeClick(e)}
          >
            <img
              src={Like}
              className={`w-4 h-4 transition-transform duration-300 ${liked ? "transform scale-125" : ""
                }`}
              alt="Like"
            />
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-[#F07EFF] text-black border-1 border-white hover:bg-white/90 w-8 h-8 p-0"
            onClick={(e) => handleCommentClick(e)}
          >
            <img src={comment} className="w-4 h-4" alt="Comment" />
          </Button>
          <div className="relative">
            <Button
              size="sm"
              className="rounded-full bg-[#6ACFAD] text-black border-1 border-white hover:bg-white/90 w-8 h-8 p-0"
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
                position="bottom"
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
