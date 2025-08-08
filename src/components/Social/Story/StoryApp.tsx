import { useState } from "react";
import { StorySidebar } from "./StorySidebar";
import { StoryViewer } from "./StoryViewer";
import image from '../../../../public/download.jpeg'
import storyJump from '../../../../public/Frame-im.png'
import storyLandscape from '../../../../public/Frame-im.png'
import storyCity from '../../../../public/Frame-im.png'
import storyOcean from '../../../../public/Frame-im.png'

// Mock data
const mockStories = [
    {
        id: "1",
        user: {
            name: "Alex Smith",
            avatar: image,
            initials: "AS"
        },
        hasNewStory: true,
        isViewed: false,
        content: [
            { id: "1-1", type: "image" as const, url: storyJump, duration: 5000 },
            { id: "1-2", type: "image" as const, url: storyLandscape, duration: 5000 }
        ]
    },
    {
        id: "2",
        user: {
            name: "Emma Johnson",
            avatar: image,
            initials: "EJ"
        },
        hasNewStory: true,
        isViewed: false,
        content: [
            { id: "2-1", type: "image" as const, url: storyCity, duration: 5000 }
        ]
    },
    {
        id: "3",
        user: {
            name: "Michael Brown",
            avatar: image,
            initials: "MB"
        },
        hasNewStory: true,
        isViewed: true,
        content: [
            { id: "3-1", type: "image" as const, url: storyOcean, duration: 5000 }
        ]
    },
    {
        id: "4",
        user: {
            name: "Sarah Wilson",
            avatar: image,
            initials: "SW"
        },
        hasNewStory: false,
        isViewed: true,
        content: [
            { id: "4-1", type: "image" as const, url: storyLandscape, duration: 5000 }
        ]
    },
    {
        id: "5",
        user: {
            name: "David Lee",
            avatar: image,
            initials: "DL"
        },
        hasNewStory: true,
        isViewed: false,
        content: [
            { id: "5-1", type: "image" as const, url: storyJump, duration: 5000 }
        ]
    },
    {
        id: "6",
        user: {
            name: "Lisa Garcia",
            avatar: image,
            initials: "LG"
        },
        hasNewStory: false,
        isViewed: true,
        content: [
            { id: "6-1", type: "image" as const, url: storyCity, duration: 5000 }
        ]
    }
];

export function StoriesApp() {
    const [activeStoryId, setActiveStoryId] = useState(mockStories[0].id);

    const currentStoryIndex = mockStories.findIndex(story => story.id === activeStoryId);
    const currentStory = mockStories[currentStoryIndex];

    const handlePrevious = () => {
        if (currentStoryIndex > 0) {
            setActiveStoryId(mockStories[currentStoryIndex - 1].id);
        }
    };

    const handleNext = () => {
        if (currentStoryIndex < mockStories.length - 1) {
            setActiveStoryId(mockStories[currentStoryIndex + 1].id);
        }
    };

    return (
        <div className="h-screen bg-background flex">
            <StorySidebar
                stories={mockStories}
                activeStoryId={activeStoryId}
                onStorySelect={setActiveStoryId}
            />

            {currentStory && (
                <StoryViewer
                    stories={currentStory.content}
                    userName={currentStory.user.name}
                    userAvatar={currentStory.user.avatar}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    hasPrevious={currentStoryIndex > 0}
                    hasNext={currentStoryIndex < mockStories.length - 1}
                />
            )}
        </div>
    );
}