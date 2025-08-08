import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import Button from "../../ui/Button";
import { Input } from "../../ui/input";
// import { cn } from "../../../lib/utils";

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
}

export function StoryViewer({ 
  stories, 
  userName, 
  userAvatar, 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const currentStory = stories[currentIndex];
  const duration = currentStory?.duration || 5000;

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
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
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, duration, onNext]);

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

  if (!currentStory) return null;

  return (
    <div className="flex-1 relative bg-background overflow-hidden">
      {/* Story Content */}
      <div className="relative h-full w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={currentStory.url}
          alt="Story content"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1">
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
        <div className="absolute top-16 left-4 right-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow p-0.5">
            <img
              src={userAvatar || "/placeholder.svg"}
              alt={userName}
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <span className="text-white font-medium">{userName}</span>
        </div>

        {/* Navigation areas */}
        <button
          onClick={handlePrevStory}
          className="absolute left-0 top-0 w-1/3 h-full z-10 focus:outline-none"
          disabled={!hasPrevious && currentIndex === 0}
        />
        <button
          onClick={handleNextStory}
          className="absolute right-0 top-0 w-1/3 h-full z-10 focus:outline-none"
          disabled={!hasNext && currentIndex === stories.length - 1}
        />

        {/* Message input */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 bg-glass-bg backdrop-blur-lg border border-glass-border rounded-full p-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Reply..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/70 focus-visible:ring-0"
            />
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 w-8 h-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side navigation */}
      {hasPrevious && (
        <Button
          variant="ghost"
        //   size="icon"
          onClick={onPrevious}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-glass-bg backdrop-blur-lg border border-glass-border text-white hover:bg-glass-bg/80"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}
      
      {hasNext && (
        <Button
          variant="ghost"
        //   size="icon"
          onClick={onNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-glass-bg backdrop-blur-lg border border-glass-border text-white hover:bg-glass-bg/80"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}