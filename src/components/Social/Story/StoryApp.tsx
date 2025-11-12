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
  userId?: string; // Add userId for sharing
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
  const selectedUserId = searchParams.get('user');
  const selectedStoryId = searchParams.get('story');

  const currentStoryIndex = stories.findIndex(
    (story) => story.id === activeStoryId
  );
  const currentStory = stories[currentStoryIndex];

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
      // Get initials from first name and last name with proper null checks
      const firstName = story.storyuser?.profile?.first_name || '';
      const lastName = story.storyuser?.profile?.last_name || '';
      const firstNameInitial = firstName?.[0] || "";
      const lastNameInitial = lastName?.[0] || "";
      const initials = `${firstNameInitial}${lastNameInitial}`.toUpperCase();

      return {
        id: story.id, // Now using the actual story ID
        userId: story.user_id, // Add userId for sharing
        is_liked: story.is_liked || false,
        user: {
          name: `${firstName} ${lastName}`.trim() || 'Unknown User',
          avatar: story.storyuser?.profile?.profile_picture || '',
          initials: initials || 'U',
        },
        hasNewStory: !story.is_viewed, // Use is_viewed instead of is_liked
        isViewed: story.is_viewed || false,
        createdAt: story.createdAt ? new Date(story.createdAt) : undefined,
        content: [
          {
            id: story.id,
            type: "video", // Assuming all are videos from the API
            url: story.video_file || '',
            duration: story?.duration || 5000, // Default duration, you might want to calculate this
          },
        ],
      };
    });
  };

  const GetStoryData = async () => {
    try {
      setIsLoading(true);
      const res = await GetStory();
      
      // Add null checks for API response
      if (res?.data?.data && Array.isArray(res.data.data)) {
        let filteredStories = res.data.data;
        
        // If a specific user is selected, filter stories for that user only
        if (selectedUserId) {
          filteredStories = res.data.data.filter((story: any) => story.user_id === selectedUserId);
        } else {
          // Group stories by user and get the most recent story per user (for general view)
          filteredStories = groupStoriesByUser(res.data.data);
        }
        
        const transformedStories = transformApiDataToStories(filteredStories);
        setStories(transformedStories);
        
        // Set active story
        if (transformedStories.length > 0) {
          if (selectedStoryId) {
            // If specific story is selected, use that
            setActiveStoryId(selectedStoryId);
          } else {
            // Otherwise, use the first story
            setActiveStoryId(transformedStories[0].id);
          }
        }
      } else {
        console.warn("Invalid API response structure:", res);
        setStories([]);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to group stories by user and return the most recent story per user
  const groupStoriesByUser = (stories: any[]) => {
    const userStoryMap = new Map();
    
    stories.forEach(story => {
      const userId = story.user_id;
      const existingStory = userStoryMap.get(userId);
      
      // If no story exists for this user, or if current story is more recent
      if (!existingStory || new Date(story.createdAt) > new Date(existingStory.createdAt)) {
        userStoryMap.set(userId, story);
      }
    });
    
    // Convert map values to array and sort by creation date (most recent first)
    return Array.from(userStoryMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  useEffect(() => {
    GetStoryData();
  }, [selectedUserId, selectedStoryId]);

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
            {selectedUserId ? "No stories available from this user" : "No stories available"}
          </h2>
          <p className="text-muted-foreground">
            {selectedUserId ? "This user hasn't posted any stories yet." : "Check back later for new stories!"}
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
          storyId={currentStory.id}
          userId={currentStory.userId}
          onStoryChange={handleStoryChange}
        />
      )}
    </div>
  );
}
