import { cn } from "../../../lib/utils";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../ui/Image";
import moment from "moment";
import { useEffect, useState } from "react";

interface Story {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  hasNewStory: boolean;
  createdAt?: Date;
  isViewed: boolean;
}

interface StorySidebarProps {
  stories: Story[];
  activeStoryId?: string;
  onStorySelect: (storyId: string) => void;
  onLoadMore?: () => void; // Add this prop
  isLoadingMore?: boolean; // Add this prop
  hasMore?: boolean; // Add this prop
}

interface TimeAgoProps {
  date: string | Date;
}

export function StorySidebar({
  stories,
  activeStoryId,
  onStorySelect,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
}: StorySidebarProps) {
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
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/social");
  };

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

  const handleLoadMoreClick = () => {
    if (onLoadMore && !isLoadingMore && hasMore) {
      onLoadMore();
    }
  };
  

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileStorySelect = (storyId: string) => {
    onStorySelect(storyId);
    setIsMobileSidebarOpen(false); // Close drawer on mobile
  };

  return (
<>
      {/* Mobile Sidebar Drawer */}
      <div className="lg:hidden">
        {/* Mobile Toggle Button - Show when sidebar is hidden on mobile */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            className="w-5 h-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 bg-card z-50 animate-in slide-in-from-left-80 duration-300">
              <div className="h-full flex flex-col">
                {/* Mobile Header */}
                <div className="shrink-0 p-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary"
                      >
                        <IoCloseOutline className="text-foreground" />
                      </button>
                      <h2 className="text-lg font-semibold text-foreground">
                        Stories
                      </h2>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary"
                    >
                      <IoCloseOutline className="text-primary" />
                    </button>
                  </div>
                </div>

                {/* Mobile Stories List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => handleMobileStorySelect(story.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2",
                        "hover:bg-secondary/50",
                        activeStoryId === story.id && "bg-[#7077FE0D]"
                      )}
                    >
                      {/* ... existing story item content ... */}
                      <div className="relative">
                        <div
                          className={cn(
                            "p-0.5 rounded-full",
                            story.hasNewStory && !story.isViewed
                              ? "bg-linear-to-r from-primary to-primary-glow"
                              : "bg-story-viewed"
                          )}
                        >
                          <div
                            className={cn(
                              "relative w-14 h-14 rounded-full p-[1.83px] bg-linear-to-r",
                              story.hasNewStory && !story.isViewed
                                ? "from-[#6340FF] to-[#D748EA]"
                                : "from-[gray] to-[gray]"
                            )}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden object-cover bg-white p-[3px]">
                              <img
                                src={
                                  story.user.avatar
                                    ? story.user.avatar
                                    : "/profile.png"
                                }
                                alt="User Avatar"
                                className="w-full h-full rounded-full object-cover bg-white"
                              />
                            </div>
                            <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-500 border border-white"></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate text-sm">
                          {story.user.name}
                        </p>
                        {story.hasNewStory && !story.isViewed && (
                          <p className="text-primary text-xs mt-1">new</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          <TimeAgo
                            date={story.createdAt ? story.createdAt : new Date()}
                          />
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Load More Button for Mobile */}
                  {hasMore && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={handleLoadMoreClick}
                        disabled={isLoadingMore}
                        className={cn(
                          "px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-sm",
                          isLoadingMore && "opacity-70 cursor-not-allowed"
                        )}
                      >
                        {isLoadingMore ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block mr-2"></span>
                            Loading...
                          </>
                        ) : (
                          "Load More Stories"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[465px] bg-card border-r border-border h-screen flex-col">
        {/* ... existing desktop sidebar code ... */}
        <div className="shrink-0">
          <div className="text-xl font-semibold text-foreground mb-6 p-6">
            <div className="w-full flex justify-between items-center">
              <div className="logo">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center" aria-label="Home">
                    <Image
                      src={`https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd`}
                      alt="Company Logo"
                      width={100}
                      className="h-auto w-[144.16px]"
                    />
                  </Link>
                </div>
              </div>

              <div className="button">
                <button
                  onClick={handleClose}
                  className="w-[35px] h-[35px] rounded-[7px] border border-strock border-[#ECEEF2] flex justify-center items-center hover:bg-gray-50 transition-colors"
                >
                  <IoCloseOutline className="text-[#E1056D]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Stories List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-6 pt-0">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => onStorySelect(story.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                  "hover:bg-secondary/50",
                  activeStoryId === story.id && "bg-[#7077FE0D]"
                )}
              >
                {/* ... existing story item content ... */}
                <div className="relative">
                  <div
                    className={cn(
                      "p-0.5 rounded-full",
                      story.hasNewStory && !story.isViewed
                        ? "bg-linear-to-r from-primary to-primary-glow"
                        : "bg-story-viewed"
                    )}
                  >
                    <div
                      className={cn(
                        "relative w-[73px] h-[73px] rounded-full p-[1.83px] bg-linear-to-r",
                        story.hasNewStory && !story.isViewed
                          ? "from-[#6340FF] to-[#D748EA]"
                          : "from-[gray] to-[gray]"
                      )}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden object-cover bg-white p-[3px]">
                        <img
                          src={
                            story.user.avatar
                              ? story.user.avatar
                              : "/profile.png"
                          }
                          alt="User Avatar"
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      <span className="absolute bottom-2.5 right-3 w-2.5 h-2.5 rounded-full bg-green-500 border-[1.5px] border-white"></span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="poppins font-medium text-foreground truncate text-[14px] leading-[100%] align-middle mb-1">
                    {story.user.name}
                  </p>
                  {story.hasNewStory && !story.isViewed && (
                    <p className="jakarta font-medium text-foreground truncate text-[14px] leading-[100%] text-[#7077FE] tracking-[0%] align-middle relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#7077FE]">
                      new
                    </p>
                  )}
                  <p className="sans font-normal not-italic text-xs leading-[150%] align-middle tracking-normal text-muted-foreground">
                    <TimeAgo
                      date={story.createdAt ? story.createdAt : new Date()}
                    />
                  </p>
                </div>
              </div>
            ))}
            {/* Load More Button */}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMoreClick}
                disabled={isLoadingMore}
                className={cn(
                  "px-4 py-2 bg-[#7077FE] hover:bg-[#5c63d4] text-white rounded-full",
                  "transition-colors duration-200",
                  "flex items-center gap-2",
                  isLoadingMore && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoadingMore ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                    Loading...
                  </>
                ) : (
                  "Load More Stories"
                )}
              </button>
            </div>
          )}

          {/* Show message when no more stories */}
          {!hasMore && stories.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                No more stories to load
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}
