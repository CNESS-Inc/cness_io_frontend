import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LazyLoadImage,
  LazyLoadComponent,
} from "react-lazy-load-image-component";

interface StoryCardProps {
  userIcon: string;
  userName: string;
  title: string;
  videoSrc: string;
  id: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  userIcon,
  userName,
  title,
  videoSrc,
  id,
}) => {
  const navigate = useNavigate();

  const handleReel = (id: any) => {
    navigate(`/story-design`);
    // navigate(`/social/reel/${id}`);
  };
  return (
    <div onClick={() => handleReel(id)}>
      <div className="relative w-40 h-80 rounded-lg overflow-hidden shadow-md">
        <LazyLoadComponent>
          <video
            className="w-full h-full object-cover absolute top-0 left-0"
            autoPlay
            loop
            muted
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </LazyLoadComponent>
        <div className="absolute bottom-0 left-0 w-full p-4">
          <h3 className="text-white text-xs font-semibold mb-2">{title}</h3>
          <div className="flex items-center">
            {/* <img
              src={userIcon}
              alt={userName}
              className="w-8 h-8 rounded-full mr-2"
            /> */}
            <LazyLoadImage
              src={userIcon}
              alt={userName}
              className="w-8 h-8 rounded-full mr-2"
              effect="blur" // Options: "blur", "opacity", "black-and-white"
            />
            <span className="text-white text-xs font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
