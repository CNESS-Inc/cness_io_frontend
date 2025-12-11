import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { StorySidebar } from "./StorySidebar";
import { StoryViewer } from "./StoryViewer";
import { GetStory, LikeStory } from "../../../Common/ServerAPI";
import { useToast } from "../../../components/ui/Toast/ToastProvider"; // Add this import

interface StoryContent {
  id: string;
  type: "image" | "video";
  url: string;
  duration: number;
}

interface StoryUser {
  name: string;
  avatar: string;
  initials: string;
}

interface Story {
  id: string;
  userId?: string;
  user: StoryUser;
  hasNewStory: boolean;
  createdAt?: Date;
  isViewed: boolean;
  content: StoryContent[];
  is_liked: boolean;
  likes_count: number;
  comments_count: number;
  video_file?: string; // Add this if you need it
}

export function StoriesApp() {
  const [searchParams] = useSearchParams();
  const [activeStoryId, setActiveStoryId] = useState<any>(null);
  const [stories, setStories] = useState<Story[]>([]);
  console.log("🚀 ~ StoriesApp ~ stories:", stories[0])
  const [isLoading, setIsLoading] = useState(true);
  
  // Add toast hook
  const { showToast } = useToast();
  
  // Add ref for storing like animation callbacks
  const likeAnimationRef = useRef<(amount?: number) => void>(() => {});

  // Get URL parameters
  const selectedUserId = searchParams.get("user");
  const selectedStoryId = searchParams.get("story");

  const currentStoryIndex = stories.findIndex(
    (story) => story.id === activeStoryId
  );
  const currentStory = stories[currentStoryIndex];

  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Reset content index when switching between stories
  useEffect(() => {
    setCurrentContentIndex(0);
  }, [currentStoryIndex]);

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      // Move to previous content in current story
      setCurrentContentIndex(currentContentIndex - 1);
    } else if (currentStoryIndex > 0) {
      // Move to previous story
      setActiveStoryId(stories[currentStoryIndex - 1].id);
      setCurrentContentIndex(0);
    }
  };

  const handleNext = () => {
    const currentStory = stories[currentStoryIndex];
    if (currentContentIndex < currentStory.content.length - 1) {
      // Move to next content in current story
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      // Move to next story
      setActiveStoryId(stories[currentStoryIndex + 1].id);
      setCurrentContentIndex(0);
    }
  };

  const GetStoryData = async () => {
    try {
      setIsLoading(true);
      const res = await GetStory();

      if (Array.isArray(res?.data?.data)) {
        let apiStories = res.data.data;

        // Transform each API story into individual Story objects
        const individualStories = transformApiDataToStories(apiStories);
        setStories(individualStories);

        // Set active story based on URL parameters
        if (individualStories.length > 0) {
          let targetStoryId = activeStoryId;

          // Priority 1: If specific story ID is provided in URL
          if (selectedStoryId) {
            const storyExists = individualStories.some(
              (story: any) => story.id === selectedStoryId
            );
            if (storyExists) {
              targetStoryId = selectedStoryId;
              setCurrentContentIndex(0);
            }
          }
          // Priority 2: If specific user is provided in URL, show their first story
          else if (selectedUserId) {
            const userStory = individualStories.find(
              (story: any) => story.userId === selectedUserId
            );
            if (userStory) {
              targetStoryId = userStory.id;
              setCurrentContentIndex(0);
            }
          }

          // If no target found or still null, use first story
          if (!targetStoryId && individualStories.length > 0) {
            targetStoryId = individualStories[0].id;
            setCurrentContentIndex(0);
          }

          setActiveStoryId(targetStoryId);
        }
      } else {
        setStories([]);
      }
    } catch (e) {
      console.error(e);
      setStories([]);
      showToast({
        message: "Failed to load stories",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to transform each API story into individual Story objects
  const transformApiDataToStories = (apiData: any[]): Story[] => {
    return apiData.map((story) => {
      const firstName = story.storyuser?.profile?.first_name || "";
      const lastName = story.storyuser?.profile?.last_name || "";
      const firstNameInitial = firstName?.[0] || "";
      const lastNameInitial = lastName?.[0] || "";
      const initials = `${firstNameInitial}${lastNameInitial}`.toUpperCase();

      return {
        id: story.id,
        userId: story.user_id,
        is_liked: story.is_liked || false,
        likes_count: story.likes_count || 0,
        comments_count: story.comments_count || 0,
        user: {
          name: `${firstName} ${lastName}`.trim() || "Unknown User",
          avatar: story.storyuser?.profile?.profile_picture || "",
          initials: initials || "U",
        },
        hasNewStory: !story.is_viewed,
        isViewed: story.is_viewed || false,
        createdAt: story.createdAt ? new Date(story.createdAt) : undefined,
        content: [
          {
            id: story.id,
            type: "video",
            url: story.video_file || "",
            duration: story?.duration || 5000,
          },
        ],
      };
    });
  };

  useEffect(() => {
    GetStoryData();
  }, [selectedUserId, selectedStoryId]);

  // UPDATED handleLikeClick function with credit animation support
  const handleLikeClick = async () => {
    if (!currentStory) return;
    
    try {
      // Store current like state before API call
      const isCurrentlyLiked = currentStory.is_liked;
      
      // Format data similar to PostsLike
      const formattedData = currentStory.id;

      // Make the API call
      const res = await LikeStory(formattedData);

      // Update karma_credits in localStorage from API response (if provided)
      if (res?.data?.data?.karma_credits !== undefined) {
        localStorage.setItem(
          "karma_credits",
          res.data.data.karma_credits.toString()
        );
        window.dispatchEvent(new Event("karmaCreditsUpdated"));
      }

      // Trigger credit animation when LIKING (not unliking)
      if (
        (import.meta.env.VITE_ENV_STAGE === "test" || 
         import.meta.env.VITE_ENV_STAGE === "uat") &&
        !isCurrentlyLiked &&
        likeAnimationRef.current
      ) {
        likeAnimationRef.current(5); // 5 credits for story like
      }

      // Update story data in state
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === currentStory.id
            ? {
                ...story,
                is_liked: !story.is_liked,
                likes_count: story.is_liked
                  ? story.likes_count - 1
                  : story.likes_count + 1,
                isViewed: true,
                hasNewStory: false,
              }
            : story
        )
      );

      // Show success toast
      showToast({
        message: isCurrentlyLiked 
          ? "Story unliked successfully" 
          : "Story liked successfully",
        type: "success",
        duration: 2000,
      });

    } catch (error: any) {
      console.error("Error liking story:", error);
      showToast({
        message: error?.response?.data?.error?.message || "Failed to like story",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleStoryChange = () => {
    // Any additional logic when story changes
  };

  // Function to register animation callback from StoryViewer
  const registerAnimationCallback = (callback: (amount?: number) => void) => {
    likeAnimationRef.current = callback;
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="h-screen bg-background flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {selectedUserId || selectedStoryId
              ? "No stories available"
              : "No stories available"}
          </h2>
          <p className="text-muted-foreground">
            {selectedUserId || selectedStoryId
              ? "The requested story is not available."
              : "Check back later for new stories!"}
          </p>
        </div>
      </div>
    );
  }

  const handleCommentCountUpdate = (storyId: string, newCount: number) => {
    console.log("🚀 ~ handleCommentCountUpdate ~ newCount:", newCount)
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId
          ? { ...story, comments_count: newCount }
          : story
      )
    );
  };

  return (
    <div className="h-screen bg-background flex">
      <StorySidebar
        stories={stories}
        activeStoryId={activeStoryId}
        onStorySelect={(storyId) => {
          setActiveStoryId(storyId);
          setCurrentContentIndex(0);
        }}
      />

      {currentStory && stories.length > 0 && (
        <StoryViewer
          allStories={stories}
          currentStoryIndex={currentStoryIndex}
          currentContentIndex={currentContentIndex}
          onContentIndexChange={setCurrentContentIndex}
          stories={currentStory.content}
          userName={currentStory.user.name}
          userAvatar={currentStory.user.avatar}
          is_liked={currentStory.is_liked}
          likes_count={currentStory.likes_count}
          comments_count={currentStory.comments_count}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentContentIndex > 0 || currentStoryIndex > 0}
          timeAgo={currentStory.createdAt}
          hasNext={
            currentContentIndex < currentStory.content.length - 1 ||
            currentStoryIndex < stories.length - 1
          }
          onLike={handleLikeClick} // Pass the updated function
          storyId={currentStory.content[currentContentIndex]?.id}
          userId={currentStory.userId}
          onStoryChange={handleStoryChange}
          // Add this prop to pass animation callback
          onRegisterAnimation={registerAnimationCallback}
          onCommentCountUpdate={(newCount) => {
            // This will update the specific story's comment count
            handleCommentCountUpdate(currentStory.id, newCount);
          }}
        />
      )}
    </div>
  );
}