import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StorySidebar } from "./StorySidebar";
import { StoryViewer } from "./StoryViewer";
import { GetStory, LikeStory } from "../../../Common/ServerAPI";

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
  is_liked: unknown;
  id: string;
  userId?: string;
  user: StoryUser;
  hasNewStory: boolean;
  createdAt?: Date;
  isViewed: boolean;
  content: StoryContent[];
}

export function StoriesApp() {
  const [searchParams] = useSearchParams();
  const [activeStoryId, setActiveStoryId] = useState<any>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        id: story.id, // Each story has its own ID
        userId: story.user_id,
        is_liked: story.is_liked || false,
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

  useEffect(() => {
    console.log(
      "Stories:",
      stories.map((s) => ({ id: s.id, user: s.user.name, createdAt: s.createdAt }))
    );
    console.log("Active story ID:", activeStoryId);
    console.log("Current story index:", currentStoryIndex);
  }, [stories, activeStoryId, currentStoryIndex]);

  const handleLikeClick = async (story: any) => {
    try {
      await LikeStory(story.id);
      // Update the story's like status in local state
      setStories((prevStories) =>
        prevStories.map((s) =>
          s.id === story.id
            ? {
                ...s,
                is_liked: !s.is_liked,
                isViewed: true,
                hasNewStory: false,
              }
            : s
        )
      );
    } catch (error) {
      console.error("Error submitting like:", error);
    }
  };

  const handleStoryChange = () => {
    // This will be called when story changes in StoryViewer
    // Any additional logic can be added here if needed
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex justify-center items-center">
        Loading...
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
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentContentIndex > 0 || currentStoryIndex > 0}
          timeAgo={currentStory.createdAt} // You might want to calculate this based on createdAt
          hasNext={
            currentContentIndex < currentStory.content.length - 1 ||
            currentStoryIndex < stories.length - 1
          }
          onLike={() => handleLikeClick(currentStory)}
          storyId={currentStory.content[currentContentIndex]?.id}
          userId={currentStory.userId}
          onStoryChange={handleStoryChange}
        />
      )}
    </div>
  );
}