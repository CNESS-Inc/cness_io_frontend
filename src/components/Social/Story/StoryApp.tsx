import { useEffect, useState } from "react";
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
  user: StoryUser;
  hasNewStory: boolean;
  isViewed: boolean;
  content: StoryContent[];
}

export function StoriesApp() {
  const [activeStoryId, setActiveStoryId] = useState<any>(null);
  const [stories, setStories] = useState<Story[]>([]);
  console.log("🚀 ~ StoriesApp ~ stories:", stories)
  const [isLoading, setIsLoading] = useState(true);

  const currentStoryIndex = stories.findIndex(
    (story) => story.id === activeStoryId
  );
  const currentStory = stories[currentStoryIndex];
  console.log("🚀 ~ StoriesApp ~ currentStory:", currentStory);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setActiveStoryId(stories[currentStoryIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setActiveStoryId(stories[currentStoryIndex + 1].id);
    }
  };

  const transformApiDataToStories = (apiData: any[]): Story[] => {
    return apiData.map((story) => {
      // Get initials from first name and last name
      const firstNameInitial = story.storyuser.profile.first_name?.[0] || "";
      const lastNameInitial = story.storyuser.profile.last_name?.[0] || "";
      const initials = `${firstNameInitial}${lastNameInitial}`.toUpperCase();

      return {
        id: story.id,
        is_liked:story.is_liked,
        user: {
          name: `${story.storyuser.profile.first_name} ${story.storyuser.profile.last_name}`,
          avatar: story.storyuser.profile.profile_picture,
          initials,
        },
        hasNewStory: !story.is_liked, // Assuming if not liked, it's a new story
        isViewed: story.is_liked, // Assuming if liked, it's viewed
        content: [
          {
            id: `${story.id}`,
            type: "video", // Assuming all are videos from the API
            url: story.video_file,
            duration: 5000, // Default duration, you might want to calculate this
          },
        ],
      };
    });
  };

  const GetStoryData = async () => {
    try {
      setIsLoading(true);
      const res = await GetStory();
      const transformedStories = transformApiDataToStories(res.data.data);
      setStories(transformedStories);
      if (transformedStories.length > 0) {
        setActiveStoryId(transformedStories[0].id);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetStoryData();
  }, []);

  const handleLikeClick = async (story: any) => {
    try {
      await LikeStory(story.id);
      // Update the story's like status in local state
      setStories((prevStories) =>
        prevStories.map((s) =>
          s.id === story.id
            ? {
                ...s,
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
        No stories available
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      <StorySidebar
        stories={stories}
        activeStoryId={activeStoryId}
        onStorySelect={setActiveStoryId}
      />

      {currentStory && (
        <StoryViewer
        allStories={stories}
          currentStoryIndex={currentStoryIndex}
          stories={currentStory.content}
          userName={currentStory.user.name}
          userAvatar={currentStory.user.avatar}
          is_liked={currentStory.is_liked}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentStoryIndex > 0}
          timeAgo="1 hour ago" // You might want to calculate this from createdAt
          hasNext={currentStoryIndex < stories.length - 1}
          onLike={() => handleLikeClick(currentStory)}
        />
      )}
    </div>
  );
}
