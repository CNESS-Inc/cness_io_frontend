import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import Button from "../../ui/Button";
import { Input } from "../../ui/input";
import Like from "../../../assets/story-like.png";
import comment from "../../../assets/story-comment.png";
import share from "../../../assets/story-share.png";
import ReelComment from "../Reels/ReelComment";

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
}

export function StoryViewer({
  stories,
  userName,
  userAvatar,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  timeAgo,
  onLike,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5000;

  useEffect(() => {
    if (isPaused || selectedReelId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setProgress(0);
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
        return prev + 100 / (duration / 100);
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, stories.length, duration, onNext, isPaused, selectedReelId]);

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onPrevious();
    }
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNext();
    }
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(!isPaused);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    setSelectedReelId(currentStory.id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  const handleCloseComments = () => {
    setSelectedReelId(null);
    setIsPaused(false);
  };

  if (!currentStory) return null;

  return (
    <div className="relative w-full h-full">
      <div className="flex-1 relative bg-[#000] overflow-hidden h-full">
        {/* Story Content */}
        <div className="relative h-full w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl">
          {currentStory.type === "image" ? (
            <img
              src={currentStory.url}
              alt="Story content"
              className="w-full h-full object-cover"
              onClick={(e) => togglePause(e)}
            />
          ) : (
            <video
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

          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-30">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: `${
                      index < currentIndex
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

          {/* Navigation areas - made smaller to avoid overlap with buttons */}
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

          {/* Message input - increased z-index */}
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <div className="flex items-center gap-2 rounded-full p-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Reply..."
                className="flex-1 bg-white backdrop-blur-lg rounded-full border-none placeholder:text-black focus-visible:ring-0"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                className="rounded-full bg-[#7077FE] text-black border-1 border-white hover:bg-white/90 w-8 h-8 p-0"
                onClick={(e) => handleLikeClick(e)}
              >
                <img src={Like} className="w-4 h-4" alt="Like" />
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-[#F07EFF] text-black border-1 border-white hover:bg-white/90 w-8 h-8 p-0"
                onClick={(e) => handleCommentClick(e)}
              >
                <img src={comment} className="w-4 h-4" alt="Comment" />
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-[#6ACFAD] text-black border-1 border-white hover:bg-white/90 w-8 h-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={share} className="w-4 h-4" alt="Share" />
              </Button>
            </div>
          </div>
        </div>

        {/* Side navigation */}
        {hasPrevious && (
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
        )}
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